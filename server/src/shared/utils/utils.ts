export const htmlCharacters: Map<string, string> = new Map([
  ["&", "&amp;"],
  ["<", "&lt;"],
  [">", "&gt;"],
  ["'", "&#39;"],
  ['"', "&quot;"],
]);

export const escapeHtml = (s: string) => {
  return s.replace(/[&<>"']/g, (m) => htmlCharacters.get(m) || m);
};
