export interface SiteContactInfo {
  phone: string;
  whatsapp: string;
  email: string;
}

// The contact details originally hardcoded across the frontend (footer,
// contact page, floating call/WhatsApp buttons). They seed the database on
// first use and act as a fallback while the API loads.
export const DEFAULT_SITE_CONTACT: SiteContactInfo = {
  phone: "+1(323) 639-5853",
  whatsapp: "+92 325 4995009",
  email: "info@alburhanquranacademy.org",
};

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^+\d]/g, "")}`;
}

export function waHref(whatsapp: string) {
  return `https://wa.me/${whatsapp.replace(/\D/g, "")}`;
}

export const PHONE_PATTERN = /^\+?[\d\s()-]{7,20}$/;
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
