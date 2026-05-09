const VARIANTS = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md",
  outline: "bg-white text-slate-700 border border-slate-200 hover:border-blue-600 hover:text-blue-600",
  ghost: "bg-transparent text-blue-600 hover:bg-blue-50",
  danger: "bg-red-500 text-white hover:bg-red-600",
};

const SIZES = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

const Button = ({ children, variant = "primary", size = "md", onClick, href, className = "", ...props }) => {
  const base = `inline-flex items-center gap-2 font-medium rounded-lg transition-all duration-150 cursor-pointer no-underline ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

  if (href) return <a href={href} className={base} {...props}>{children}</a>;
  return <button className={base} onClick={onClick} {...props}>{children}</button>;
};

export default Button;