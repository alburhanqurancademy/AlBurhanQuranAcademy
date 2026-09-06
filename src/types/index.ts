export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "superadmin";
  createdAt: string;
}

export interface IBlog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image?: string;
  category: string;
  status: "draft" | "published";
  author?: string;
  createdAt: string;
}

export interface ICourse {
  _id: string;
  title: string;
  slug: string;
  description: string;
  image?: string;
  duration?: string;
  level: "beginner" | "intermediate" | "advanced";
  status: "active" | "inactive";
  createdAt: string;
}

export interface IEnrollment {
  _id: string;
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
  status: "pending" | "approved" | "rejected";
  message?: string;
  createdAt: string;
}

export interface IContact {
  _id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface ITrial {
  _id: string;
  name: string;
  email: string;
  phone: string;
  course?: string;
  preferred?: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}
