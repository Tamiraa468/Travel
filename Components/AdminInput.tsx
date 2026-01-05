"use client";

type Props = {
  label: string;
  placeholder?: string;
  value: string | number;
  onChange: (value: string | number) => void;
  type?:
    | "text"
    | "email"
    | "number"
    | "password"
    | "textarea"
    | "date"
    | "datetime-local";
  error?: string;
  required?: boolean;
  rows?: number;
};

export default function AdminInput({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  error,
  required,
  rows,
}: Props) {
  const isTextarea = type === "textarea";

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-forest-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {isTextarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows || 4}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 ${
            error ? "border-red-500" : "border-sand"
          }`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) =>
            onChange(
              type === "number" ? parseFloat(e.target.value) : e.target.value
            )
          }
          placeholder={placeholder}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 ${
            error ? "border-red-500" : "border-sand"
          }`}
        />
      )}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
