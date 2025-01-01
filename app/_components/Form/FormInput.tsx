import { ButtonHTMLAttributes, InputHTMLAttributes, useState } from "react";

// FormInput Component
interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  type: string;
  placeholder: string;
}

// Button Component
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  isLoading = false,
  variant = "primary",
  fullWidth = false,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles = "py-3 rounded transition-colors relative";
  const widthStyles = fullWidth ? "w-full" : "";
  const variantStyles = {
    primary:
      "bg-[#C6A14E] text-black hover:bg-[#B89346] disabled:bg-[#C6A14E]/50",
    secondary:
      "bg-[#1D1D1D] text-white hover:bg-[#2D2D2D] disabled:bg-[#1D1D1D]/50",
  };

  return (
    <button
      className={`${baseStyles} ${widthStyles} ${variantStyles[variant]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : null}
      <span className={isLoading ? "invisible" : ""}>{children}</span>
    </button>
  );
};

export const FormInput: React.FC<FormInputProps> = ({
  label,
  type: initialType,
  placeholder,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = initialType === "password";
  const type = isPassword ? (showPassword ? "text" : "password") : initialType;

  return (
    <div>
      <label className="block mb-2">{label}</label>
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          className={`w-full px-4 py-3 bg-[#1D1D1D] border border-darkGray/60 rounded font-light placeholder:font-light placeholder:tracking-wider placeholder:text-[#9B9B9B]/70 focus:border-[#C6A14E] focus:outline-none ${
            isPassword ? "pr-28" : ""
          }`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C6A14E] text-sm bg-[#1D1D1D] px-2 py-1 z-10"
          >
            {showPassword ? "Hide Password" : "Show Password"}
          </button>
        )}
      </div>
    </div>
  );
};
