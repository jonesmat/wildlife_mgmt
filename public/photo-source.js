// Shared photo-source picker.
//
// The plain hidden <input type="file" accept="image/*"> that pages used
// before opens straight to the file system on many mobile browsers, hiding
// the camera and other photo apps. This helper instead lets the user choose
// the source: on a touch device it shows "Take Photo" (opens the camera via
// the capture attribute) and "Choose Photo" (the OS photo picker, which on
// phones includes the gallery and other apps like Google Photos). On a
// desktop (fine pointer) there's no camera concept, so it just opens the
// file picker directly.
//
//   pickPhoto({ multiple: true }, function (FileList) { ... })
//
// Include with <script src="/photo-source.js"></script> before any script
// that calls pickPhoto.
(function() {
  'use strict';

  // True when the primary input is touch (phone/tablet) — desktops with a
  // mouse report a fine pointer even if they also have a touchscreen.
  function prefersChooser() {
    try { return window.matchMedia('(pointer: coarse)').matches; }
    catch (e) { return ('ontouchstart' in window) || navigator.maxTouchPoints > 0; }
  }

  // Fire a throwaway file input, hand its files to onFiles, then clean up.
  // Some mobile browsers only open the picker for an input that's in the DOM,
  // so it's appended (off-screen) for the lifetime of the pick.
  function openInput(opts, onFiles) {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    if (opts.multiple) input.multiple = true;
    if (opts.capture) input.setAttribute('capture', 'environment'); // rear camera
    input.style.position = 'fixed';
    input.style.left = '-9999px';
    input.style.opacity = '0';

    var handled = false;
    function cleanup() {
      window.removeEventListener('focus', onFocus, true);
      if (input.parentNode) input.parentNode.removeChild(input);
    }
    input.addEventListener('change', function() {
      handled = true;
      if (input.files && input.files.length) onFiles(input.files);
      cleanup();
    });
    // If the picker is dismissed without choosing, no change event fires but
    // focus returns to the window — clean the orphaned input up then.
    function onFocus() {
      setTimeout(function() { if (!handled) cleanup(); }, 400);
    }
    window.addEventListener('focus', onFocus, true);

    document.body.appendChild(input);
    input.click();
  }

  var stylesAdded = false;
  function addStyles() {
    if (stylesAdded) return;
    stylesAdded = true;
    var style = document.createElement('style');
    style.textContent =
      '.ps-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:1100;' +
        'display:flex;align-items:flex-end;justify-content:center}' +
      '.ps-sheet{background:white;border-radius:14px 14px 0 0;width:440px;max-width:100vw;' +
        'padding:18px 18px calc(18px + env(safe-area-inset-bottom,0px));' +
        'box-shadow:0 -4px 24px rgba(0,0,0,0.25);font-family:Arial,sans-serif;' +
        'animation:psUp 0.2s ease}' +
      '@keyframes psUp{from{transform:translateY(100%)}to{transform:none}}' +
      '.ps-title{font-size:0.95rem;font-weight:700;color:#1a4a1a;text-align:center;margin:2px 0 14px}' +
      '.ps-opt{display:flex;align-items:center;gap:14px;width:100%;border:1px solid #cfe0c8;' +
        'background:#f6faf4;border-radius:10px;padding:15px 18px;margin-bottom:10px;cursor:pointer;' +
        'font-size:1rem;font-weight:600;color:#1a4a1a;text-align:left}' +
      '.ps-opt:hover{background:#eef5ec}' +
      '.ps-opt .ps-ico{font-size:1.5rem;line-height:1}' +
      '.ps-opt .ps-sub{display:block;font-size:0.76rem;font-weight:400;color:#777;margin-top:2px}' +
      '.ps-cancel{width:100%;border:none;background:#eef0ec;border-radius:10px;padding:13px;' +
        'font-size:0.95rem;font-weight:600;color:#444;cursor:pointer;margin-top:2px}' +
      '.ps-cancel:hover{background:#e2e6df}' +
      '@media (min-width:520px){.ps-overlay{align-items:center}.ps-sheet{border-radius:14px;' +
        'animation:psPop 0.18s ease}.ps-sheet{padding-bottom:18px}}' +
      '@keyframes psPop{from{opacity:0;transform:scale(0.96)}to{opacity:1;transform:none}}';
    document.head.appendChild(style);
  }

  function showChooser(opts, onFiles) {
    addStyles();
    var overlay = document.createElement('div');
    overlay.className = 'ps-overlay';
    overlay.innerHTML =
      '<div class="ps-sheet" role="dialog" aria-modal="true" aria-label="Add a photo">' +
        '<div class="ps-title">Add a Photo</div>' +
        '<button type="button" class="ps-opt ps-camera"><span class="ps-ico">📷</span>' +
          '<span>Take Photo<span class="ps-sub">Use your camera</span></span></button>' +
        '<button type="button" class="ps-opt ps-library"><span class="ps-ico">🖼️</span>' +
          '<span>Choose Photo<span class="ps-sub">Photo library or other apps</span></span></button>' +
        '<button type="button" class="ps-cancel">Cancel</button>' +
      '</div>';

    function close() {
      document.removeEventListener('keydown', onKey);
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }
    function onKey(ev) { if (ev.key === 'Escape') { ev.preventDefault(); close(); } }
    overlay.addEventListener('click', function(ev) { if (ev.target === overlay) close(); });
    overlay.querySelector('.ps-camera').addEventListener('click', function() {
      close(); openInput({ capture: true, multiple: false }, onFiles);
    });
    overlay.querySelector('.ps-library').addEventListener('click', function() {
      close(); openInput({ multiple: opts.multiple }, onFiles);
    });
    overlay.querySelector('.ps-cancel').addEventListener('click', close);
    document.addEventListener('keydown', onKey);
    document.body.appendChild(overlay);
  }

  // opts.multiple — allow selecting several at once (library path only).
  window.pickPhoto = function(opts, onFiles) {
    opts = opts || {};
    if (typeof onFiles !== 'function') return;
    if (prefersChooser()) showChooser(opts, onFiles);
    else openInput({ multiple: opts.multiple }, onFiles);
  };
})();
