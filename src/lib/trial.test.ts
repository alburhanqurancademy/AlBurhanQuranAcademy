import assert from "node:assert/strict";
import test from "node:test";

import { sanitizeTrialInput, validateTrialInput } from "./trial";

test("sanitizeTrialInput trims and normalizes email", () => {
  const payload = sanitizeTrialInput({
    name: "  Aisha Khan  ",
    email: " AISHA@Example.com ",
    phone: "  +1 555 123 4567  ",
    course: "  Quran Memorizing  ",
    message: "  I want a trial class.  ",
  });

  assert.equal(payload.name, "Aisha Khan");
  assert.equal(payload.email, "aisha@example.com");
  assert.equal(payload.phone, "+1 555 123 4567");
  assert.equal(payload.course, "Quran Memorizing");
  assert.equal(payload.message, "I want a trial class.");
});

test("validateTrialInput rejects missing required fields", () => {
  const result = validateTrialInput({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  assert.equal(result.ok, false);
  assert.match(result.message || "", /name|email|phone|message/i);
});
