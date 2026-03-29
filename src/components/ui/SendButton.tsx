import React from "react";
import { FiSend } from "react-icons/fi";

interface SendButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

const iconSizeMap = {
  sm: 16,
  md: 18,
  lg: 20,
};

export const SendButton: React.FC<SendButtonProps & { className?: string }> = ({
  onClick,
  disabled = false,
  loading = false,
  size = "md",
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${sizeMap[size]}
        flex items-center justify-center
        rounded-full
        transition-all duration-200
        ${disabled || loading
          ? "opacity-50 cursor-not-allowed"
          : " active:scale-95"}
        ${className}
      `}
    >
      {loading ? (
        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <FiSend
          size={iconSizeMap[size]}
          className="text-white/80"
        />
      )}
    </button>
  );
};
