import assert from "node:assert/strict";
import test from "node:test";

import { buildEnrollmentPayload } from "./enrollment";

test("buildEnrollmentPayload maps the form fields to schema keys", () => {
  const payload = buildEnrollmentPayload(
    {
      name: "Ayesha Khan",
      email: "AYESHA@EXAMPLE.COM",
      phone: "+123456789",
      country: "Pakistan",
      gender: "Female",
      age: "12",
      guardianName: "Ali Khan",
      guardianPhone: "+987654321",
      convenientTimeFrom: "18:00",
      convenientTimeTo: "20:00",
      frequency: "5 Days a Week",
      daySlot: "",
      message: "Please contact me",
    },
    "Quranic Qaidah"
  );

  assert.equal(payload.name, "Ayesha Khan");
  assert.equal(payload.email, "ayesha@example.com");
  assert.equal(payload.country, "Pakistan");
  assert.equal(payload.guardianName, "Ali Khan");
  assert.equal(payload.convenientTimeFrom, "18:00");
  assert.equal(payload.frequency, "5 Days a Week");
  assert.equal(payload.daySlot, "");
  assert.equal(payload.course, "Quranic Qaidah");
  assert.deepEqual(Object.keys(payload).sort(), [
    "age",
    "convenientTimeFrom",
    "convenientTimeTo",
    "country",
    "course",
    "daySlot",
    "email",
    "frequency",
    "gender",
    "guardianName",
    "guardianPhone",
    "message",
    "name",
    "phone",
  ].sort());
});
