// Custom in-app replacements for window.alert and window.confirm.
// appDialog('message', 'Title'?)  -> Promise<void>, resolves on dismiss
// appConfirm('message', 'Title'?, 'Confirm label'?) -> Promise<boolean>
(function() {
  var style = document.createElement('style');
  style.id = 'app-dialog-style'; // id marks it persistent so the SPA router won't swap it out
  style.textContent =
    '.app-dialog-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:1000;' +
      'display:flex;align-items:center;justify-content:center}' +
    '.app-dialog{background:white;border-radius:10px;padding:22px 26px;width:420px;' +
      'max-width:calc(100vw - 48px);box-shadow:0 8px 32px rgba(0,0,0,0.25);' +
      'font-family:Arial,sans-serif;animation:appDialogIn 0.18s ease}' +
    '@keyframes appDialogIn{from{opacity:0;transform:scale(0.96)}to{opacity:1;transform:none}}' +
    '.app-dialog h3{color:#1a4a1a;font-size:1.02rem;margin:0 0 10px}' +
    '.app-dialog-msg{font-size:0.9rem;color:#444;line-height:1.55;word-wrap:break-word}' +
    '.app-dialog-actions{display:flex;justify-content:flex-end;margin-top:18px}' +
    '.app-dialog-ok{background:#1a4a1a;color:white;border:none;border-radius:6px;' +
      'padding:9px 26px;font-size:0.9rem;font-weight:600;cursor:pointer}' +
    '.app-dialog-ok:hover{background:#256325}' +
    '.app-dialog-ok.danger{background:#b32424}' +
    '.app-dialog-ok.danger:hover{background:#8b1a1a}' +
    '.app-dialog-cancel{background:#e8f0e8;color:#1a4a1a;border:none;border-radius:6px;' +
      'padding:9px 22px;font-size:0.9rem;font-weight:600;cursor:pointer;margin-right:8px}' +
    '.app-dialog-cancel:hover{background:#d0e4d0}';
  document.head.appendChild(style);

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function buildDialog(message, title, opts) {
    return new Promise(function(resolve) {
      var overlay = document.createElement('div');
      overlay.className = 'app-dialog-overlay';
      overlay.innerHTML =
        '<div class="app-dialog">' +
          (title ? '<h3>' + esc(title) + '</h3>' : '') +
          '<div class="app-dialog-msg">' + esc(message).replace(/\n/g, '<br>') + '</div>' +
          '<div class="app-dialog-actions">' +
            (opts.confirm ? '<button class="app-dialog-cancel">Cancel</button>' : '') +
            '<button class="app-dialog-ok' + (opts.danger ? ' danger' : '') + '">' + esc(opts.okLabel || 'OK') + '</button>' +
          '</div>' +
        '</div>';
      function close(result) {
        document.removeEventListener('keydown', onKey);
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        resolve(result);
      }
      function onKey(ev) {
        if (ev.key === 'Escape') { ev.preventDefault(); close(false); }
        if (ev.key === 'Enter') { ev.preventDefault(); close(true); }
      }
      overlay.addEventListener('click', function(ev) { if (ev.target === overlay) close(false); });
      overlay.querySelector('.app-dialog-ok').addEventListener('click', function() { close(true); });
      var cancel = overlay.querySelector('.app-dialog-cancel');
      if (cancel) cancel.addEventListener('click', function() { close(false); });
      document.addEventListener('keydown', onKey);
      document.body.appendChild(overlay);
      overlay.querySelector('.app-dialog-ok').focus();
    });
  }

  window.appDialog = function(message, title) {
    return buildDialog(message, title, {}).then(function() { return undefined; });
  };

  window.appConfirm = function(message, title, okLabel) {
    return buildDialog(message, title, { confirm: true, danger: true, okLabel: okLabel || 'Delete' });
  };
})();
