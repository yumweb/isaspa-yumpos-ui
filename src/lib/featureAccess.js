// Premium add-on access rule (WhatsApp / GMB), mirrored from the platform
// subscription gate. A feature is "active" when the location's enabled flag is
// on AND its expiry date is in the future — OR the user is corporate (corporate
// bypasses every feature gate, same as the platform-expiry behavior).
//
// userInfo comes from localStorage `yumpos_user_info`, populated at
// /auth/set-location with: isWhatsappEnabled, whatsappExpiry, isGmbEnabled,
// gmbExpiry, isCorporate.

const FEATURES = {
  whatsapp: { enabledKey: "isWhatsappEnabled", expiryKey: "whatsappExpiry" },
  gmb: { enabledKey: "isGmbEnabled", expiryKey: "gmbExpiry" },
};

export const getUserInfo = () => {
  try {
    return JSON.parse(window.localStorage.getItem("yumpos_user_info") || "{}");
  } catch {
    return {};
  }
};

/**
 * @returns {{ enabled:boolean, expiry:(string|null), active:boolean,
 *            expired:boolean, isCorporate:boolean }}
 */
export const getFeatureAccess = (userInfo, feature) => {
  const cfg = FEATURES[feature] || {};
  const u = userInfo || {};
  const enabled = !!u[cfg.enabledKey];
  const expiry = u[cfg.expiryKey] || null;
  const isCorporate = !!u.isCorporate;

  const startOfToday = new Date(new Date().setHours(0, 0, 0, 0));
  const notExpired = !!expiry && new Date(expiry) >= startOfToday;

  const active = isCorporate || (enabled && notExpired);
  const expired = enabled && !notExpired && !isCorporate;

  return { enabled, expiry, active, expired, isCorporate };
};
