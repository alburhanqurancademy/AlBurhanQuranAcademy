import React from "react";

type ButtonVariant = "primary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  className = "",
  icon,
}: ButtonProps) {
  const base =
    "inline-flex items-center gap-2 font-semibold tracking-wide rounded-sm transition-all duration-300 cursor-pointer select-none";

  const sizes: Record<ButtonSize, string> = {
    sm: "px-5 py-2 text-xs",
    md: "px-7 py-2.5 text-sm",
    lg: "px-9 py-3.5 text-sm",
  };

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-[var(--color-green-mid)] text-white hover:bg-[var(--color-green-light)] shadow-[0_4px_20px_rgba(27,94,32,0.35)] hover:shadow-[0_4px_28px_rgba(27,94,32,0.55)]",
    outline:
      "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] shadow-[0_4px_20px_rgba(191,69,0,0.35)] hover:shadow-[0_4px_28px_rgba(191,69,0,0.55)]",
    ghost:
      "text-[var(--color-accent-light)] hover:text-white underline underline-offset-4",
  };

  const classes = `${base} ${sizes[size]} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
        {icon && <span className="ml-1">{icon}</span>}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {children}
      {icon && <span className="ml-1">{icon}</span>}
    </button>
  );
}