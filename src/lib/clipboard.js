// Copy text to the clipboard. Works on insecure origins (e.g. http://192.168.x.x during testing)
// and older browsers, where navigator.clipboard is unavailable.

/**
 * Resolves to true when the text was copied, false otherwise. Never throws.
 * `container` is where the temporary fallback field is attached; pass the open <dialog> when
 * copying from inside a modal dialog, because everything outside a modal dialog is inert.
 */
export async function copyToClipboard(text, container) {
  if (typeof window === "undefined") return false;

  try {
    if (window.isSecureContext && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Permission denied or document not focused: try the fallback below.
  }

  const field = document.createElement("textarea");
  try {
    field.value = text;
    field.setAttribute("readonly", "");
    field.setAttribute("aria-hidden", "true");
    // 16px font avoids the iOS zoom-on-focus; fixed + transparent keeps the page from scrolling or flashing.
    field.style.cssText = "position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;font-size:16px;";
    (container || document.body).appendChild(field);
    field.focus({ preventScroll: true });
    field.select();
    field.setSelectionRange(0, text.length);
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    field.remove();
  }
}
