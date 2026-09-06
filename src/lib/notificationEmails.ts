// HTML email templates for form-submission notifications:
// - an admin notification carrying the full submitted form
// - a professional auto-reply confirmation for the applicant

const ACCENT = "#fa841e";
const DARK = "#111827";
const MUTED = "#6b7280";
const SITE_NAME = "Al Burhan Quran Academy";
const SITE_URL = "https://alburhanquranacademy.org";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function detailRows(fields: { label: string; value?: string }[]) {
  return fields
    .filter((f) => f.value && f.value.trim())
    .map(
      ({ label, value }) => `
        <tr>
          <td style="padding: 8px 12px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: bold; color: ${DARK}; width: 180px; font-size: 14px;">${label}</td>
          <td style="padding: 8px 12px; border: 1px solid #e5e7eb; color: ${DARK}; font-size: 14px;">${escapeHtml(value!).replace(/\n/g, "<br />")}</td>
        </tr>`
    )
    .join("");
}

function wrapper(content: string) {
  return `
  <div style="background: #f4f4f5; padding: 32px 16px; font-family: Arial, Helvetica, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
      <div style="background: ${DARK}; padding: 20px 28px;">
        <p style="margin: 0; color: #ffffff; font-size: 18px; font-weight: bold;">${SITE_NAME}</p>
        <div style="width: 40px; height: 3px; background: ${ACCENT}; border-radius: 2px; margin-top: 8px;"></div>
      </div>
      <div style="padding: 28px;">
        ${content}
      </div>
      <div style="padding: 16px 28px; background: #f9fafb; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0; color: ${MUTED}; font-size: 12px; line-height: 1.6;">
          This is an automated email from ${SITE_NAME}.<br />
          <a href="${SITE_URL}" style="color: ${ACCENT}; text-decoration: none;">${SITE_URL.replace("https://", "")}</a>
        </p>
      </div>
    </div>
  </div>`;
}

// ─── Admin notifications ────────────────────────────────────────────────────

export function buildEnrollmentAdminEmail(data: {
  name: string;
  email: string;
  phone: string;
  course: string;
  country?: string;
  gender?: string;
  age?: string;
  guardianName?: string;
  guardianPhone?: string;
  convenientTimeFrom?: string;
  convenientTimeTo?: string;
  frequency?: string;
  daySlot?: string;
  message?: string;
}) {
  const convenientTime =
    data.convenientTimeFrom || data.convenientTimeTo
      ? `${data.convenientTimeFrom || "—"} to ${data.convenientTimeTo || "—"}`
      : undefined;

  const html = wrapper(`
    <h2 style="margin: 0 0 6px; color: ${DARK}; font-size: 20px;">New Course Enrollment</h2>
    <p style="margin: 0 0 20px; color: ${MUTED}; font-size: 14px;">A new enrollment form was submitted on the website.</p>
    <table cellpadding="0" cellspacing="0" style="border-collapse: collapse; width: 100%;">
      ${detailRows([
        { label: "Full Name", value: data.name },
        { label: "Email", value: data.email },
        { label: "Phone", value: data.phone },
        { label: "Country", value: data.country },
        { label: "Gender", value: data.gender },
        { label: "Age", value: data.age },
        { label: "Guardian Name", value: data.guardianName },
        { label: "Guardian Phone", value: data.guardianPhone },
        { label: "Course", value: data.course },
        { label: "Convenient Time", value: convenientTime },
        { label: "Class Frequency", value: data.frequency },
        { label: "Preferred Days", value: data.daySlot },
        { label: "Message", value: data.message },
      ])}
    </table>
  `);

  return {
    subject: `New Enrollment — ${data.name} (${data.course})`,
    html,
  };
}

export function buildTrialAdminEmail(data: {
  name: string;
  email: string;
  phone: string;
  course?: string;
  message?: string;
}) {
  const html = wrapper(`
    <h2 style="margin: 0 0 6px; color: ${DARK}; font-size: 20px;">New Trial Class Request</h2>
    <p style="margin: 0 0 20px; color: ${MUTED}; font-size: 14px;">A new trial class form was submitted on the website.</p>
    <table cellpadding="0" cellspacing="0" style="border-collapse: collapse; width: 100%;">
      ${detailRows([
        { label: "Full Name", value: data.name },
        { label: "Email", value: data.email },
        { label: "Phone", value: data.phone },
        { label: "Course", value: data.course },
        { label: "Message", value: data.message },
      ])}
    </table>
  `);

  return {
    subject: `New Trial Class Request — ${data.name}`,
    html,
  };
}

// ─── Applicant auto-reply ───────────────────────────────────────────────────

export function buildAutoReplyEmail(data: {
  name: string;
  type: "enrollment" | "trial";
  course?: string;
}) {
  const isEnrollment = data.type === "enrollment";
  const requestLabel = isEnrollment
    ? `your enrollment${data.course ? ` for <strong>${escapeHtml(data.course)}</strong>` : ""}`
    : `your trial class request${data.course ? ` for <strong>${escapeHtml(data.course)}</strong>` : ""}`;

  const html = wrapper(`
    <h2 style="margin: 0 0 16px; color: ${DARK}; font-size: 20px;">Assalamu Alaikum ${escapeHtml(data.name)},</h2>
    <p style="margin: 0 0 14px; color: ${DARK}; font-size: 15px; line-height: 1.7;">
      Thank you for reaching out to <strong>${SITE_NAME}</strong>. We have received ${requestLabel} and our team is reviewing your details.
    </p>
    <p style="margin: 0 0 14px; color: ${DARK}; font-size: 15px; line-height: 1.7;">
      One of our representatives will contact you shortly — usually within 24 hours — to guide you through the next steps and answer any questions you may have.
    </p>
    <div style="margin: 20px 0; padding: 14px 18px; background: #fff7ed; border-left: 4px solid ${ACCENT}; border-radius: 6px;">
      <p style="margin: 0; color: ${DARK}; font-size: 14px; line-height: 1.6;">
        <strong>What happens next?</strong><br />
        Our team reviews your request, matches you with a suitable teacher and schedule, and reaches out to confirm everything with you.
      </p>
    </div>
    <p style="margin: 0 0 4px; color: ${DARK}; font-size: 15px; line-height: 1.7;">
      Warm regards,
    </p>
    <p style="margin: 0; color: ${DARK}; font-size: 15px; font-weight: bold;">
      The ${SITE_NAME} Team
    </p>
  `);

  return {
    subject: isEnrollment
      ? `We've received your enrollment — ${SITE_NAME}`
      : `We've received your trial class request — ${SITE_NAME}`,
    html,
  };
}
