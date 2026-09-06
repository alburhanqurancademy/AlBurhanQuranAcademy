import { connectDB } from "@/lib/mongodb";
import { Enrollment } from "@/models/Enrollment";
import { Trial } from "@/models/Trial";
import { Blog } from "@/models/Blog";
import { Course } from "@/models/Course";

// Force this page to be rendered fresh on every request. Without this, Next.js has no
// signal that the page depends on live data (no cookies()/headers()/searchParams are read
// directly in this component), so it can statically prerender it once at build time and
// keep serving that same snapshot to every visitor — which is why new enrollments never
// showed up here and the KPI stayed frozen.
export const dynamic = "force-dynamic";

const statusColors: Record<string, string> = {
  pending:  "text-yellow-400 bg-yellow-400/10 border border-yellow-400/30",
  approved: "text-green-400 bg-green-400/10 border border-green-400/30",
  rejected: "text-red-400 bg-red-400/10 border border-red-400/30",
  confirmed: "text-green-400 bg-green-400/10 border border-green-400/30",
  cancelled: "text-red-400 bg-red-400/10 border border-red-400/30",
  completed: "text-violet-400 bg-violet-400/10 border border-violet-400/30",
};

// "confirmed" is the trial status stored in the database — displayed as "Approved"
// to match the enrollment wording used elsewhere in the admin dashboard.
const trialStatusLabels: Record<string, string> = {
  pending: "Pending",
  confirmed: "Approved",
  cancelled: "Rejected",
  completed: "Completed",
};

// "Today" boundaries in the server's local time — recomputed on every request
// (this page is force-dynamic) so the lists automatically reset at midnight.
function getTodayRange() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  return { startOfDay, endOfDay };
}

async function getTodaysTrials() {
  await connectDB();
  const { startOfDay, endOfDay } = getTodayRange();
  return Trial.find({ createdAt: { $gte: startOfDay, $lte: endOfDay } }).sort({ createdAt: -1 }).lean();
}

async function getTodaysEnrollments() {
  await connectDB();
  const { startOfDay, endOfDay } = getTodayRange();
  return Enrollment.find({ createdAt: { $gte: startOfDay, $lte: endOfDay } }).sort({ createdAt: -1 }).lean();
}

async function getStats() {
  await connectDB();

  const [
    totalEnrollments,
    pendingEnrollments,
    rejectedEnrollments,
    approvedEnrollments,
    completedEnrollments,
    totalTrials,
    pendingTrials,
    activeTrials,
    cancelledTrials,
    completedTrials,
    totalCourses,
    activeCourses,
    totalBlogs,
    publishedBlogs,
  ] = await Promise.all([
    Enrollment.countDocuments({}),
    Enrollment.countDocuments({ status: "pending" }),
    Enrollment.countDocuments({ status: "rejected" }),
    Enrollment.countDocuments({ status: "approved" }),
    Enrollment.countDocuments({ status: "completed" }),
    Trial.countDocuments({}),
    Trial.countDocuments({ status: "pending" }),
    Trial.countDocuments({ status: "confirmed" }),
    Trial.countDocuments({ status: "cancelled" }),
    Trial.countDocuments({ status: "completed" }),
    Course.countDocuments({}),
    Course.countDocuments({ status: "active" }),
    Blog.countDocuments({}),
    Blog.countDocuments({ status: "published" }),
  ]);

  return {
    totalEnrollments,
    pendingEnrollments,
    rejectedEnrollments,
    approvedEnrollments,
    completedEnrollments,
    totalTrials,
    pendingTrials,
    activeTrials,
    cancelledTrials,
    completedTrials,
    totalCourses,
    activeCourses,
    totalBlogs,
    publishedBlogs,
  };
}

export default async function DashboardPage() {
  const [todaysTrials, todaysEnrollments, s] = await Promise.all([
    getTodaysTrials(),
    getTodaysEnrollments(),
    getStats(),
  ]);

  // Computed inside the request handler (not at module scope) so it reflects
  // "today" on every request rather than freezing at server-process start.
  const todayLabel = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  // Built fresh per-request (rather than mutating a shared module-level array) so
  // concurrent requests on the same warm server instance can never see each other's values.
  const stats = [
    { label: "Total Students",           value: String(s.totalEnrollments + s.totalTrials), change: "Enrollments + trials",                color: "var(--color-accent)",      icon: "M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" },
    { label: "Total Completed Students", value: String(s.completedEnrollments + s.completedTrials), change: "Enrollments + trials",       color: "#a78bfa",                  icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { label: "Total Enrollments",        value: String(s.totalEnrollments),                 change: `${s.pendingEnrollments} pending`,     color: "var(--color-accent)",      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
    { label: "Approved Enrollments",     value: String(s.approvedEnrollments),              change: `${s.rejectedEnrollments} rejected`,   color: "#4ade80", changeColor: "#f87171", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
    { label: "Total Trials",             value: String(s.totalTrials),                      change: `${s.pendingTrials} pending`,          color: "#f59e0b",                  icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
    { label: "Approved Trial Requests",    value: String(s.activeTrials),                     change: `${s.cancelledTrials} rejected`,       color: "#4ade80", changeColor: "#f87171", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
    { label: "Total Courses",            value: String(s.totalCourses),                     change: `${s.activeCourses} active`,           color: "var(--color-green-light)", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
    { label: "Total Blogs",              value: String(s.totalBlogs),                       change: `${s.publishedBlogs} published`,       color: "var(--color-sky)",         icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 12h6" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-black text-white">Dashboard</h2>
        <p className="text-gray-400 text-sm mt-1">Welcome back, Admin — here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, change, color, changeColor, icon }) => (
          <div key={label} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `color-mix(in srgb, ${color} 18%, transparent)` }}>
              <svg className="w-5 h-5" fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-black text-white">{value}</p>
              <p className="text-gray-400 text-xs mt-0.5">{label}</p>
              <p className="text-xs mt-0.5" style={{ color: changeColor ?? color }}>{change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Today's Enrollments */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between flex-wrap gap-1">
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest">Today&apos;s Enrollments</h3>
            <p className="text-gray-500 text-xs mt-0.5">{todayLabel}</p>
          </div>
          <a href="/admin/enrollments" className="text-[var(--color-accent)] text-xs font-semibold hover:underline">View All</a>
        </div>
        {todaysEnrollments.length === 0 ? (
          <p className="px-6 py-10 text-center text-gray-400 text-sm">There are no enrollments yet today.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left px-6 py-3 text-gray-400 font-semibold text-xs uppercase tracking-wider">Student</th>
                <th className="text-left px-6 py-3 text-gray-400 font-semibold text-xs uppercase tracking-wider">Course</th>
                <th className="text-left px-6 py-3 text-gray-400 font-semibold text-xs uppercase tracking-wider">Time</th>
                <th className="text-left px-6 py-3 text-gray-400 font-semibold text-xs uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {todaysEnrollments.map((enrollment: any) => (
                <tr key={enrollment._id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-3.5 text-white font-medium">
                    <div className="flex flex-col">
                      <span>{enrollment.name}</span>
                      <span className="text-xs text-gray-500">{enrollment.email || "—"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-gray-400">
                    <div className="flex flex-col gap-0.5">
                      <span>{enrollment.course}</span>
                      <span className="text-xs text-gray-500">{enrollment.country || "—"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-gray-500 text-xs">{new Date(enrollment.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</td>
                  <td className="px-6 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[enrollment.status] || statusColors.pending}`}>{enrollment.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Today's Trial Requests */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between flex-wrap gap-1">
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest">Today&apos;s Trial Requests</h3>
            <p className="text-gray-500 text-xs mt-0.5">{todayLabel}</p>
          </div>
          <a href="/admin/trials" className="text-[var(--color-accent)] text-xs font-semibold hover:underline">View All</a>
        </div>
        {todaysTrials.length === 0 ? (
          <p className="px-6 py-10 text-center text-gray-400 text-sm">There are no trial requests yet today.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left px-6 py-3 text-gray-400 font-semibold text-xs uppercase tracking-wider">Student</th>
                <th className="text-left px-6 py-3 text-gray-400 font-semibold text-xs uppercase tracking-wider">Course</th>
                <th className="text-left px-6 py-3 text-gray-400 font-semibold text-xs uppercase tracking-wider">Time</th>
                <th className="text-left px-6 py-3 text-gray-400 font-semibold text-xs uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {todaysTrials.map((trial: any) => (
                <tr key={trial._id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-3.5 text-white font-medium">{trial.name}</td>
                  <td className="px-6 py-3.5 text-gray-400">{trial.course || "—"}</td>
                  <td className="px-6 py-3.5 text-gray-500 text-xs">{new Date(trial.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</td>
                  <td className="px-6 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[trial.status] || statusColors.pending}`}>{trialStatusLabels[trial.status] ?? trial.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
