import { useCallback, useEffect, useRef, useState } from "react";
import clientAdapter from "../lib/clientAdapter";

// Minimal hook to bootstrap WhatsApp Embedded Signup per current location
export default function useWhatsAppEsu(locationIdOverride) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const csrfRef = useRef(null);

  const currentLocation = JSON.parse(
    window.localStorage.getItem("yumpos_location") || "{}"
  );
  const locationId = locationIdOverride || currentLocation?.locationId;

  const loadSdk = useCallback(() => {
    if (window.FB) return Promise.resolve("loaded");
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.onload = () => resolve("loaded");
      script.onerror = () => resolve("error");
      // Fallback in case the onload never fires (e.g., network blocked)
      setTimeout(() => resolve("timeout"), 4000);
      document.body.appendChild(script);
    });
  }, []);

  const initSdk = useCallback((cfg) => {
    const c = cfg;
    if (!c?.appId || !c?.graphVersion) return;
    window.fbAsyncInit = function () {
      if (!window.FB) return;
      window.FB.init({
        appId: c.appId,
        autoLogAppEvents: true,
        xfbml: true,
        version: c.graphVersion,
      });
    };
  }, []);

  useEffect(() => {
    if (!locationId) return;
    (async () => {
      try {
        setLoading(true);
        const cfg = await clientAdapter.startWhatsappEsu(locationId);
        csrfRef.current = cfg?.csrf;
        setConfig(cfg);
        // set fbAsyncInit right away; do not block on SDK network
        initSdk(cfg);
        // fire-and-forget load; we do not await to avoid UI freeze if network blocks
        loadSdk().then((state) => {
          if (state !== "loaded" && state !== "timeout") {
            setError("Facebook SDK failed to load");
          }
        });
      } catch (e) {
        setError(e?.message || "Failed to load ESU config");
      } finally {
        setLoading(false);
      }
    })();
  }, [locationId]);

  const launch = useCallback(() => {
    if (!config?.configId) return;
    if (!window.FB) {
      // SDK not ready yet
      alert('Facebook SDK is not loaded yet. Please try again in a few seconds.');
      return;
    }
    const featureType = config?.featureType || "";
    const sessionInfoVersion = "3";
    const extras = {
      setup: config?.solutionId ? { solutionID: config.solutionId } : {},
      featureType,
      sessionInfoVersion,
    };

    const fbLoginCallback = function(response) {
      try {
        const code = response && response.authResponse ? response.authResponse.code : null;
        const payload = { code, sessionEvent: null, csrf: csrfRef.current };
        // fire-and-forget to avoid returning an async function to FB SDK
        clientAdapter.exchangeWhatsappEsu(locationId, payload).catch(() => {});
      } catch (e) {
        // no-op
      }
    };

    // window message listener for session info
    const onMessage = function(event) {
      if (!event.origin.endsWith("facebook.com")) return;
      try {
        const data = JSON.parse(event.data);
        if (data?.type === "WA_EMBEDDED_SIGNUP") {
          clientAdapter.exchangeWhatsappEsu(locationId, {
            code: null,
            sessionEvent: data,
            csrf: csrfRef.current,
          }).catch(() => {});
        }
      } catch {}
    };
    window.addEventListener("message", onMessage);

    window.FB.login(fbLoginCallback, {
      config_id: String(config.configId),
      response_type: "code",
      override_default_response_type: true,
      extras,
    });

    // no cleanup return from click handler
  }, [config, locationId]);

  return { config, loading, error, launch };
}
