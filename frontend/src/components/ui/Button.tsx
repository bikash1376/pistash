import React from "react";

type ButtonProps = {
  text: string;
  size?: "small" | "medium" | "large";
  color?: "primary" | "secondary" | "success" | "danger";
  onClick?: () => void;
};

const buttonStyles = {
  size: {
    small: "px-2 py-1 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg",
  },
  color: {
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    secondary: "bg-black hover:bg-gray-800 text-white",
    success: "bg-green-500 hover:bg-green-600 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
  },
};

const Button: React.FC<ButtonProps> = ({ text, size = "medium", color = "primary", onClick }) => {
  return (
    <button
      className={`rounded-md font-semibold ${buttonStyles.size[size]} ${buttonStyles.color[color]}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;