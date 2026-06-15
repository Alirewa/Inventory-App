const toast = document.getElementById('toast');
const toastInner = document.getElementById('toast-inner');
const toastMsg = document.getElementById('toast-msg');
const toastIcon = document.getElementById('toast-icon');

let hideTimer = null;

const configs = {
  success: {
    classes: 'bg-emerald-950 border-emerald-500/30 text-emerald-300',
    path: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  error: {
    classes: 'bg-red-950 border-red-500/30 text-red-300',
    path: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  warning: {
    classes: 'bg-amber-950 border-amber-500/30 text-amber-300',
    path: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  },
};

export function showToast(message, type = 'success') {
  const cfg = configs[type] || configs.success;

  toastMsg.textContent = message;
  toastInner.className = `flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-semibold shadow-2xl border ${cfg.classes}`;
  toastIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${cfg.path}" />`;

  toast.classList.add('show');

  if (hideTimer) clearTimeout(hideTimer);
  hideTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}
