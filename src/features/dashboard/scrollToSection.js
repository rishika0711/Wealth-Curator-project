/** Scroll to element id (react-native-web maps nativeID → id). */
export function scrollToSection(nativeId) {
  if (typeof document === 'undefined') return;
  requestAnimationFrame(() => {
    document.getElementById(nativeId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}
