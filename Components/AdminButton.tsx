"use client";

type Props = {
  children: React.ReactNode;
  variant?: "primary" | "danger" | "secondary";
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
};

export default function AdminButton({
  children,
  variant = "primary",
  disabled = false,
  onClick,
  type = "button",
  className = "",
}: Props) {
  const baseStyles =
    "px-4 py-2 rounded-lg font-medium transition duration-200 disabled:opacity-50";

  const variantStyles = {
    primary: "bg-forest-700 text-ivory hover:bg-forest-900",
    danger: "bg-red-600 text-white hover:bg-red-700",
    secondary: "bg-sand text-charcoal hover:bg-stone/30",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
