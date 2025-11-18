import React from "react";

const IconWrapper: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {children}
  </svg>
);

export const MapPin: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </IconWrapper>
);

export const Phone: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </IconWrapper>
);

export const Leaf: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M11 20A7 7 0 0 1 4 13V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2a2 2 0 0 0 4 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v5.5a3.5 3.5 0 0 1-3.5 3.5h-1.1" />
    <path d="M12 9a3 3 0 0 0-3 3v1a3 3 0 0 0 6 0v-1a3 3 0 0 0-3-3" />
  </IconWrapper>
);

export const Users: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </IconWrapper>
);

export const Zap: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </IconWrapper>
);

export const Heart: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </IconWrapper>
);

export const ChevronDown: React.FC<{ className?: string }> = ({
  className,
}) => (
  <IconWrapper className={className}>
    <polyline points="6 9 12 15 18 9" />
  </IconWrapper>
);

export const Play: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <polygon points="5 3 19 12 5 21 5 3" />
  </IconWrapper>
);

export const Mountain: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
  </IconWrapper>
);

export const Award: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
  </IconWrapper>
);

export const Globe: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
  </IconWrapper>
);
