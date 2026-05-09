import { useState } from "react";

const Card = ({ children, hover = false, className = "" }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => hover && setHovered(true)}
      onMouseLeave={() => hover && setHovered(false)}
      className={`bg-white rounded-2xl border border-slate-200 p-6 transition-all duration-200 ${hover ? "cursor-pointer" : ""} ${hovered ? "-translate-y-1 shadow-xl" : "shadow-sm"} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;