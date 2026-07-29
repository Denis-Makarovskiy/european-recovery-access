# Partner Outreach Engine — design

Purpose: drive 276 professional contacts (interventionists, family-law
attorneys, private psychiatrists) to a decided outcome, so the referral-channel
hypothesis is confirmed or refuted with numbers rather than impressions.

Hypothesis under test: *US professionals who encounter family addiction /
mental-health crises will refer clients to an independent European placement
service when it costs them nothing and solves their client's problem.*

Refutation threshold (decide before running, not after): if after 200 delivered
first-touches the positive-reply rate is under 3% and fewer than 3 calls are
booked, the channel is refuted and we stop, rather than blaming the copy.

## Non-negotiable boundaries

1. **No autonomous sending in phase 1.** The agent drafts; a human approves in
   Telegram; only then does it send. Cold outreach to licensed professionals
   under a real person's name is the owner's reputation, not the model's.
2. **The agent never signs anything.** It can send an agreement draft and log
   the response; a human executes.
3. **No referral fees, ever** — patient brokering is criminal in several US
   states. The agent must be blocked from proposing compensation-for-referral
   in any wording; this is enforced by a hard content check before queueing,
   not only by prompt instruction.
4. **CASL**: Canadian rows are LinkedIn-only. The engine must refuse to queue
   email for `country = Canada`.
5. **CAN-SPAM**: every outbound email carries the Podgorica postal address and
   a working opt-out. An opt-out sets `status = opted_out` permanently and is
   irreversible by the agent.

## Data model (Cloudflare D1 — SQLite at the edge)

Chosen because the account, the Worker and the deploy token already exist; no
new vendor, no monthly cost at this volume, and the Worker that already
receives leads can serve the CRM API too.

```sql
contact(
  id, segment, name, role, org, state, country,
  email, contact_url, phone, linkedin_url,
  source_url, notes,
  channel,               -- email | form | linkedin | phone
  status,                -- see pipeline below
  owner,                 -- 'agent' | 'human'
  next_action_at,        -- when the engine should look at it again
  created_at, updated_at
)

touch(                   -- every outbound and inbound event
  id, contact_id, direction,   -- out | in
  channel, subject, body,
  drafted_by,            -- 'agent' | 'human'
  approved_by, approved_at,
  sent_at, provider_message_id,
  created_at
)

stage_event(id, contact_id, from_status, to_status, reason, at)

metric_daily(day, segment, sent, delivered, bounced, replied, positive, calls, agreements)
```

## Pipeline

```
new → queued → sent → (bounced | no_reply | replied)
replied → { interested → call_booked → agreement_sent → partner
          | not_now (snooze 90d)
          | refused → closed
          | opted_out → closed (terminal) }
```

Rules:
- `no_reply` after 10 days → one follow-up, then `closed_no_reply`. Never a
  third touch; that is what turns cold outreach into spam.
- Any inbound reply immediately sets `owner = human` and notifies Telegram.
  The agent does not answer a real professional unsupervised in phase 1.
- `not_now` re-enters the queue after 90 days with a different angle.

## Components

1. **Worker `partner-engine`** (new, separate from the lead Worker)
   - `POST /import` — CSV → contact rows, dedup by email+name.
   - Cron trigger every 30 min: select contacts where
     `next_action_at <= now AND status IN (new, not_now_due)`, cap per run
     (throttle: max 25 first-touches/day/segment to protect domain reputation).
   - For each: call the Anthropic API to draft a personalised message from the
     approved template + the contact's public context (`notes`, `org`,
     `source_url`), then run the **blocklist check** (referral fee wording,
     guarantees, medical claims, "24/48 hours"). Fail → discard, flag.
   - Queue the draft to Telegram with inline buttons: **Approve / Edit / Skip**.
2. **Telegram control surface** — the approval queue, plus `/stats`,
   `/pause`, `/resume`, `/contact <email>`. Reuses the existing bot.
3. **Email sending** — Resend (or Postmark) on a **separate outreach domain**,
   never `recoveryeurope.com`. Replies land in `admissions@`, inbound webhook
   posts to the Worker → status `replied` → human notified.
4. **Dashboard** — one static page on Pages, behind Cloudflare Access,
   reading the D1 API: funnel by segment, per-day sends, reply rates against
   the refutation threshold.

## Phasing

- **P1 (build first):** import, pipeline, Telegram approval queue, manual send
  logging. Value even with zero automation: it is the CRM.
- **P2:** agent drafting + blocklist + Resend sending on the outreach domain.
- **P3:** inbound reply detection, auto-stage moves, dashboard.
- **P4 (only after ~50 approved-without-edit drafts in a segment):** relax the
  gate for that segment to auto-send, keeping a human on every reply.

## What this costs to run

D1 and Workers: free at this volume. Resend: free to 3k emails/month.
Anthropic API for drafting: cents per draft. The real cost is the outreach
domain and two weeks of warm-up before volume.

## Owner decisions required before P2

1. Outreach domain to buy and warm up (e.g. `recoveryeurope.net`).
2. Email provider account (Resend recommended — simplest domain verification).
3. Anthropic API key for the drafting agent.
4. Whose name signs the letters, and their real signature block.

---

# Extension: reaching every contact, on every channel

Goal: no contact silently stalls. Every one of the 276 rows must end in a
terminal state — `partner`, `closed_no_reply`, `refused`, `opted_out` or
`unreachable` — and the system must be able to prove it at any moment.

## Channel router

Each contact has an ordered channel plan derived from the data it actually
carries, not from a guess:

| Available data | Plan |
|---|---|
| email (US) | email → (no reply ×2) → form if present → phone brief |
| form only (US) | form → (no reply) → phone brief |
| Canada (any data) | linkedin only — CASL forbids the rest |
| linkedin only | linkedin |
| phone only | phone brief |

Escalation happens on schedule, not on mood: a channel is exhausted after its
own rule (email: 1 follow-up; form: 1 submission; linkedin: 1 invite +
1 message after acceptance; phone: 2 attempts), then the router advances.
When the last channel in the plan is exhausted → `unreachable`, which is
terminal and counts in the coverage ledger.

## Channel: LinkedIn (browser agent, assisted — not automated)

**Risk stated plainly:** LinkedIn's User Agreement forbids automated messaging
and scraping. Tooling that sends at volume gets accounts restricted and then
permanently banned. The Canadian half of the base is LinkedIn-only, so losing
the account costs the whole segment. Therefore the design is *assisted*, and
deliberately keeps a human in the loop:

1. The engine picks the next LinkedIn-channel contact and produces a draft.
2. A browser agent opens that profile in the operator's real Chrome session,
   verifies it is the right person (name + firm + city against the CSV row),
   and types the message into the compose box.
3. **The human presses Send.** The agent never clicks the final button.
4. The operator confirms in Telegram; the engine records the touch and sets
   the next check date.

Volume cap: 15–20 profiles/day, spread over hours, mirroring human pace.
Connection invites carry a note and count as the first touch; a message is only
sent after acceptance. No invite is ever re-sent.

This keeps ~90% of the labour automated (selection, verification, drafting,
logging) while the account-risking action stays a human keystroke.

## Channel: contact forms (browser agent, assisted)

Public contact forms exist to receive enquiries, so filling one is ordinary
use — but the same shape applies: agent navigates, fills the approved text,
screenshots the filled form, human confirms submission. The screenshot is
stored as the touch record, since forms give no message id.

## Channel: phone

The engine generates a one-page call brief (who, firm, why relevant, what to
say, what not to say) and a callback slot; a human calls and records the
outcome in Telegram with one tap. Two attempts, then the channel is exhausted.

## Coverage ledger — the "nothing gets lost" guarantee

- Every contact carries `next_action_at`. Nothing may sit with a null value in
  a non-terminal state; a nightly integrity job flags any that do.
- `/coverage` in Telegram answers, at any moment: how many contacts are
  untouched, in flight, terminal, and by segment — plus the oldest untouched
  row, so stalls surface immediately.
- Weekly digest: contacts advanced, replies, and the running numbers against
  the refutation threshold.

## Sequencing across channels

The base is worked segment by segment, not all at once: interventionists first
(68 direct emails — the only segment with real deliverability), then attorney
forms, then psychiatrists, with LinkedIn running in parallel at its own slow
pace. This keeps the daily human review load at roughly 20–30 items.
