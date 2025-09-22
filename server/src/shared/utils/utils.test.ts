import { expect, test } from "@jest/globals";
import { escapeHtml, htmlCharacters } from "./utils";

test("escape html characters", () => {
  const danger = "<script>XSS</script>";
  expect(escapeHtml(danger)).toBe(
    `${htmlCharacters.get("<")}script${htmlCharacters.get(
      ">"
    )}XSS${htmlCharacters.get("<")}/script${htmlCharacters.get(">")}`
  );
});

test("escape html characters raw", () => {
  const danger = "<script>XSS</script>";
  expect(escapeHtml(danger)).toBe("&lt;script&gt;XSS&lt;/script&gt;");
});
