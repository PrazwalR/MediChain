import React from "react";

const AppointmentIcon = ({ width = 200, height = 200 }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background */}
      <rect width="200" height="200" rx="12" fill="url(#backgroundGradient)" />

      {/* Medical Cross Background */}
      <circle cx="100" cy="100" r="45" fill="rgba(255, 255, 255, 0.1)" />

      {/* Calendar Base */}
      <rect x="60" y="45" width="80" height="110" rx="8" fill="white" stroke="#0d6efd" strokeWidth="2" />

      {/* Calendar Header */}
      <rect x="60" y="45" width="80" height="20" rx="8" fill="#0d6efd" />

      {/* Calendar Rings */}
      <circle cx="75" cy="50" r="3" fill="white" />
      <circle cx="125" cy="50" r="3" fill="white" />

      {/* Calendar Grid Lines */}
      <line x1="70" y1="75" x2="130" y2="75" stroke="#e5e5e5" strokeWidth="1" />
      <line x1="70" y1="90" x2="130" y2="90" stroke="#e5e5e5" strokeWidth="1" />
      <line x1="70" y1="105" x2="130" y2="105" stroke="#e5e5e5" strokeWidth="1" />
      <line x1="70" y1="120" x2="130" y2="120" stroke="#e5e5e5" strokeWidth="1" />
      <line x1="70" y1="135" x2="130" y2="135" stroke="#e5e5e5" strokeWidth="1" />

      <line x1="85" y1="65" x2="85" y2="155" stroke="#e5e5e5" strokeWidth="1" />
      <line x1="100" y1="65" x2="100" y2="155" stroke="#e5e5e5" strokeWidth="1" />
      <line x1="115" y1="65" x2="115" y2="155" stroke="#e5e5e5" strokeWidth="1" />

      {/* Highlighted Appointment Date */}
      <rect x="86" y="76" width="13" height="13" rx="2" fill="#0d6efd" />
      <text x="92.5" y="86" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">15</text>

      {/* Medical Cross Icon */}
      <g transform="translate(145, 55)">
        <circle cx="12" cy="12" r="12" fill="#4a90e2" />
        <path d="M8 12h8M12 8v8" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Stethoscope Icon */}
      <g transform="translate(35, 55)">
        <path d="M8 2C8 2 8 6 12 6C16 6 16 2 16 2" stroke="#4a90e2" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M12 6V14" stroke="#4a90e2" strokeWidth="2" strokeLinecap="round" />
        <circle cx="16" cy="16" r="2" fill="#4a90e2" />
        <circle cx="8" cy="16" r="2" fill="#4a90e2" />
      </g>

      {/* Clock Icon */}
      <g transform="translate(160, 125)">
        <circle cx="10" cy="10" r="10" stroke="#0d6efd" strokeWidth="2" fill="rgba(13, 110, 253, 0.1)" />
        <path d="M10 5v5l3 3" stroke="#0d6efd" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* MediChain Text */}
      <text x="100" y="180" textAnchor="middle" fontSize="12" fill="white" fontWeight="600">
        MediChain Appointment
      </text>

      {/* Decorative Medical Elements */}
      <g opacity="0.3">
        <circle cx="30" cy="30" r="3" fill="white" />
        <circle cx="170" cy="30" r="3" fill="white" />
        <circle cx="30" cy="170" r="3" fill="white" />
        <circle cx="170" cy="170" r="3" fill="white" />
      </g>

      <defs>
        <linearGradient
          id="backgroundGradient"
          x1="0"
          y1="0"
          x2="200"
          y2="200"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#0d6efd" />
          <stop offset="50%" stopColor="#4a90e2" />
          <stop offset="100%" stopColor="#6ea8fe" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default AppointmentIcon;