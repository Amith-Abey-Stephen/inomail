export const SESSION_EXPIRY_MS = 60 * 60 * 1000; // 1 hour in ms

export const setSessionExpiry = () => {
  localStorage.setItem("sessionExpiry", Date.now() + SESSION_EXPIRY_MS);
};
