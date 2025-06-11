export const Logo: React.FC = () => {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      <rect width="32" height="32" rx="8" fill="#475569" />
      <rect x="3" y="10" width="8" height="12" rx="2" fill="#FFFFFF" />
      <rect x="21" y="10" width="8" height="12" rx="2" fill="#FFFFFF" />
      <path d="M14 16 L18 16" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M16 14 L16 18" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
};