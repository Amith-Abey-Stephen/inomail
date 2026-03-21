export const toast = {
  success: (message) => {
    window.dispatchEvent(new CustomEvent('custom-toast', { detail: { message, type: 'success' } }));
  },
  error: (message) => {
    window.dispatchEvent(new CustomEvent('custom-toast', { detail: { message, type: 'error' } }));
  },
  warn: (message) => {
    window.dispatchEvent(new CustomEvent('custom-toast', { detail: { message, type: 'warning' } }));
  },
  info: (message) => {
    window.dispatchEvent(new CustomEvent('custom-toast', { detail: { message, type: 'info' } }));
  }
};
