"use client";

import Script from "next/script";
import { YM_ID, IS_YM_CONFIGURED } from "@/lib/analytics";

/**
 * Yandex Metrica counter. Renders nothing (no script, no noscript pixel)
 * when `NEXT_PUBLIC_YM_ID` is unset — mirrors the GA4 wiring in
 * `app/layout.tsx`, which only mounts its scripts when
 * `IS_ANALYTICS_CONFIGURED` is true.
 *
 * `webvisor` is deliberately hard-coded to `false` and must stay that way:
 * Webvisor records session replay, including keystrokes typed into form
 * fields. This site's forms collect names, phone numbers and answers about
 * a person's addiction (see lib/analytics.ts's PII rules) — recording that
 * would be a serious privacy breach. Do not enable it, even via env var.
 */
export function YandexMetrica() {
  if (!IS_YM_CONFIGURED) return null;

  return (
    <>
      <Script id="ym-init" strategy="afterInteractive">
        {`
          (function(m,e,t,r,i,k,a){
            m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a);
          })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

          ym(${YM_ID}, "init", {
            defer: true,
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true,
            // Deliberately false — see the module-level comment above.
            webvisor: false,
            trackHash: true
          });
        `}
      </Script>
      <noscript>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element -- Yandex's
              own fallback pixel snippet; next/image's optimizer doesn't
              apply to (and isn't configured for) this external tracking
              endpoint. */}
          <img
            src={`https://mc.yandex.ru/watch/${YM_ID}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
            width={1}
            height={1}
          />
        </div>
      </noscript>
    </>
  );
}
