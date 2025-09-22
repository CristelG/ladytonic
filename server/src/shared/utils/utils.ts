export const escapeHtml = (s: string) => {
  const htmlCharacters: Map<string, string> = new Map([
    ["&", "&amp;"],
    ["<", "&lt;"],
    [">", "&gt;"],
    ["'", "&#39;"],
    ['"', "&quot;"],
  ]);

  return s.replace(/[&<>"']/g, (m) => htmlCharacters.get(m) || m);
};
