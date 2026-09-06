import assert from "node:assert/strict";
import test from "node:test";

import { buildContactEmailHtml, getMailConfig } from "./mail";

test("buildContactEmailHtml includes the submitted details", () => {
  const html = buildContactEmailHtml({
    name: "Aisha",
    email: "aisha@example.com",
    phone: "+1 555 555 5555",
    course: "Quran Memorizing",
    message: "I would like a trial class.",
  });

  assert.match(html, /Aisha/);
  assert.match(html, /aisha@example.com/);
  assert.match(html, /Quran Memorizing/);
  assert.match(html, /trial class/);
});

test("getMailConfig returns undefined when SMTP settings are not configured", () => {
  const config = getMailConfig();
  assert.equal(config, undefined);
});
