"use client";

import { useEffect, useRef, useState } from "react";

const inputClass =
  "bg-[var(--color-black)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[var(--color-accent)]/60";

type Msg = { type: "success" | "error"; text: string } | null;

export default function AdminSettingsPage() {
  const [profile, setProfile] = useState({ name: "", email: "", image: "" });
  const [profileLoading, setProfileLoading] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [photoMsg, setPhotoMsg] = useState<Msg>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<Msg>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user)
          setProfile({
            name: d.user.name ?? "",
            email: d.user.email ?? "",
            image: d.user.image ?? "",
          });
      })
      .catch(() => {})
      .finally(() => setProfileLoading(false));
  }, []);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setPhotoMsg(null);

    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      setPhotoMsg({ type: "error", text: "Only JPG, PNG, WEBP or GIF images are allowed." });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/auth/profile-picture", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");

      setProfile((p) => ({ ...p, image: data.image }));
      window.dispatchEvent(new Event("auth:refresh"));
      setPhotoMsg({ type: "success", text: "Profile picture updated." });
    } catch (err) {
      setPhotoMsg({ type: "error", text: err instanceof Error ? err.message : "Upload failed." });
    } finally {
      setUploading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMsg({ type: "error", text: "All password fields are required." });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordMsg({ type: "error", text: "New password must be at least 8 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "New passwords do not match." });
      return;
    }
    if (newPassword === currentPassword) {
      setPasswordMsg({ type: "error", text: "New password must be different from the current password." });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/auth/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update password");

      setPasswordMsg({ type: "success", text: "Password updated successfully." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordMsg({ type: "error", text: err instanceof Error ? err.message : "Failed to update password." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-black text-white">My Profile</h2>
        <p className="text-gray-400 text-sm mt-1">Manage your account and site settings</p>
      </div>

      {/* Profile */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 flex flex-col gap-5">
        <h3 className="text-white font-bold text-sm uppercase tracking-widest">Profile</h3>

        {profileLoading ? (
          <div className="flex flex-col gap-5 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gray-700/40 shrink-0" />
              <div className="flex flex-col items-start gap-2">
                <div className="h-9 w-32 rounded-xl bg-gray-700/40" />
                <div className="h-2.5 w-28 rounded bg-gray-700/25" />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <div className="h-2.5 w-20 rounded bg-gray-700/30" />
                <div className="h-10 w-full rounded-xl bg-gray-700/25" />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="h-2.5 w-16 rounded bg-gray-700/30" />
                <div className="h-10 w-full rounded-xl bg-gray-700/25" />
              </div>
            </div>
          </div>
        ) : (
        <>
        {/* Profile picture */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10 flex items-center justify-center shrink-0">
            {profile.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.image} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <svg className="w-8 h-8 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
          </div>
          <div className="flex flex-col items-start gap-1.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="px-4 py-2 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold transition-colors"
            >
              {uploading ? "Uploading..." : "Change Photo"}
            </button>
            <p className="text-gray-500 text-xs">JPG, PNG, WEBP or GIF.</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>
        </div>
        {photoMsg && (
          <p className={`text-xs font-semibold ${photoMsg.type === "success" ? "text-green-400" : "text-red-400"}`}>
            {photoMsg.text}
          </p>
        )}

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Full Name</label>
            <input
              type="text"
              value={profile.name}
              disabled
              readOnly
              className={`${inputClass} opacity-60 cursor-not-allowed`}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Email</label>
            <input
              type="email"
              value={profile.email}
              disabled
              readOnly
              className={`${inputClass} opacity-60 cursor-not-allowed`}
            />
          </div>
          <p className="text-gray-500 text-xs">Name and email cannot be changed.</p>
        </div>
        </>
        )}
      </div>

      {/* Change Password */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 flex flex-col gap-5">
        <h3 className="text-white font-bold text-sm uppercase tracking-widest">Change Password</h3>
        <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Current Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Confirm New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              className={inputClass}
            />
          </div>
          {passwordMsg && (
            <p className={`text-xs font-semibold ${passwordMsg.type === "success" ? "text-green-400" : "text-red-400"}`}>
              {passwordMsg.text}
            </p>
          )}
          <button
            type="submit"
            disabled={saving}
            className="self-start px-5 py-2.5 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold transition-colors"
          >
            {saving ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
