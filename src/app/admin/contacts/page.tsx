"use client";

import { useEffect, useState } from "react";
import { PHONE_PATTERN, EMAIL_PATTERN } from "@/lib/siteContact";
import TableSkeleton from "@/components/admin/TableSkeleton";

type FieldKey = "phone" | "whatsapp" | "email";

interface ContactData {
  phone: string;
  whatsapp: string;
  email: string;
  updatedAt?: string;
}

const FIELDS: {
  key: FieldKey;
  label: string;
  hint: string;
  inputType: string;
  placeholder: string;
  icon: React.ReactNode;
  iconClass: string;
}[] = [
  {
    key: "phone",
    label: "Phone Number",
    hint: "Shown in the footer, contact page and call button",
    inputType: "tel",
    placeholder: "+1 000 000 0000",
    iconClass: "bg-[var(--color-sky)]/10 border-[var(--color-sky)]/30 text-[var(--color-sky)]",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M6.62 10.79a15.053 15.053 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.25 1.01l-2.2 2.2z" />
      </svg>
    ),
  },
  {
    key: "whatsapp",
    label: "WhatsApp Number",
    hint: "Used for the floating WhatsApp chat button",
    inputType: "tel",
    placeholder: "+92 300 0000000",
    iconClass: "bg-green-400/10 border-green-400/30 text-green-400",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.859L.057 23.492a.5.5 0 0 0 .6.6l5.699-1.484A11.954 11.954 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.502-5.17-1.378l-.371-.214-3.384.881.9-3.312-.229-.381A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
      </svg>
    ),
  },
  {
    key: "email",
    label: "Email Address",
    hint: "Shown in the footer and contact page",
    inputType: "email",
    placeholder: "info@example.org",
    iconClass: "bg-[var(--color-accent)]/10 border-[var(--color-accent)]/30 text-[var(--color-accent)]",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m2 7 10 7 10-7" />
      </svg>
    ),
  },
];

function validateField(key: FieldKey, value: string): string | null {
  const v = value.trim();
  if (!v) return "This field is required.";
  if (key === "email") return EMAIL_PATTERN.test(v) ? null : "Please enter a valid email address.";
  return PHONE_PATTERN.test(v) ? null : "Please enter a valid number.";
}

function formatUpdated(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit",
  });
}

export default function AdminContactsPage() {
  const [contact, setContact] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");

  const [editing, setEditing] = useState<FieldKey | null>(null);
  const [draft, setDraft] = useState("");
  const [draftError, setDraftError] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedField, setSavedField] = useState<FieldKey | null>(null);

  useEffect(() => {
    fetch("/api/site-contact")
      .then((r) => r.json())
      .then((d) => {
        if (d.contact) setContact(d.contact);
        else throw new Error(d.message || "Failed to load contact info");
      })
      .catch((err) => setListError(err instanceof Error ? err.message : "Failed to load contact info"))
      .finally(() => setLoading(false));
  }, []);

  const startEdit = (key: FieldKey) => {
    if (!contact) return;
    setEditing(key);
    setDraft(contact[key]);
    setDraftError("");
    setSavedField(null);
  };

  const cancelEdit = () => {
    setEditing(null);
    setDraft("");
    setDraftError("");
  };

  const saveEdit = async (key: FieldKey) => {
    const error = validateField(key, draft);
    if (error) {
      setDraftError(error);
      return;
    }

    setSaving(true);
    setDraftError("");
    try {
      const res = await fetch("/api/site-contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: draft.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update");

      setContact(data.contact);
      setEditing(null);
      setDraft("");
      setSavedField(key);
      setTimeout(() => setSavedField(null), 3000);
    } catch (err) {
      setDraftError(err instanceof Error ? err.message : "Failed to update.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-black text-white">Contacts</h2>
        <p className="text-gray-400 text-sm mt-1">
          Manage the contact details shown across the website
        </p>
      </div>

      {listError && (
        <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">{listError}</p>
      )}

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
          <h3 className="text-white font-bold text-sm uppercase tracking-widest">Contact Information</h3>
          {contact?.updatedAt && (
            <span className="text-gray-500 text-xs">Last updated: {formatUpdated(contact.updatedAt)}</span>
          )}
        </div>

        {loading ? (
          <TableSkeleton rows={3} columns={2} showAvatar={false} showActions={false} />
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left px-5 py-3.5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Field</th>
                <th className="text-left px-5 py-3.5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Value</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {!contact ? (
                <tr>
                  <td colSpan={3} className="px-5 py-10 text-center text-gray-400">Contact info unavailable.</td>
                </tr>
              ) : (
                FIELDS.map(({ key, label, hint, inputType, placeholder, icon, iconClass }) => {
                  const isEditing = editing === key;
                  return (
                    <tr key={key} className="border-b border-[var(--color-border)] last:border-0 hover:bg-white/[0.02] transition-colors align-top">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${iconClass}`}>
                            {icon}
                          </div>
                          <div>
                            <p className="text-white font-medium">{label}</p>
                            <p className="text-gray-500 text-xs mt-0.5">{hint}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {isEditing ? (
                          <div className="flex flex-col gap-1.5 max-w-xs">
                            <input
                              type={inputType}
                              value={draft}
                              placeholder={placeholder}
                              autoFocus
                              onChange={(e) => { setDraft(e.target.value); setDraftError(""); }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") { e.preventDefault(); saveEdit(key); }
                                if (e.key === "Escape") cancelEdit();
                              }}
                              className={`w-full bg-[var(--color-black)] border rounded-xl px-3.5 py-2 text-white text-sm placeholder-gray-500 focus:outline-none transition-colors ${
                                draftError ? "border-red-500" : "border-[var(--color-accent)]/60"
                              }`}
                            />
                            {draftError && <p className="text-red-400 text-xs">{draftError}</p>}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 pt-1.5">
                            <span className="text-gray-300">{contact[key]}</span>
                            {savedField === key && (
                              <span className="flex items-center gap-1 text-green-400 text-xs font-semibold">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                Saved
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => saveEdit(key)}
                                disabled={saving}
                                className="px-4 py-2 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold transition-colors"
                              >
                                {saving ? "Saving..." : "Save"}
                              </button>
                              <button
                                onClick={cancelEdit}
                                disabled={saving}
                                className="px-4 py-2 rounded-xl border border-[var(--color-border)] text-gray-400 hover:text-white text-xs font-semibold transition-colors disabled:opacity-40"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => startEdit(key)}
                              disabled={editing !== null}
                              title={`Edit ${label.toLowerCase()}`}
                              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[var(--color-border)] text-gray-400 hover:text-white hover:border-[var(--color-accent)]/50 text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        )}
      </div>

      <p className="text-gray-500 text-xs">
        Changes are saved to the database and reflected on the website — footer, contact page, and the floating call &amp; WhatsApp buttons.
      </p>
    </div>
  );
}
