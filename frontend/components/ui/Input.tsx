import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className = "", ...props }, ref) => {
  return (
    <div>
      {label && <label className="block text-sm mb-1">{label}</label>}
      <input
        ref={ref}
        className={`w-full border rounded px-3 py-2 ${error ? "border-danger" : "border-border"} ${className}`}
        {...props}
      />
      {error && <p className="text-danger text-xs mt-1">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";
export default Input;