import React from "react";

const Nav1 = () => {
  return (
    <svg
      className="logo-abbr"
      width={52}
      height={52}
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Medical Cross Background Circle */}
      <circle cx="26" cy="26" r="24" fill="url(#paint0_linear)" stroke="#fff" strokeWidth="2" />

      {/* Medical Cross */}
      <path
        d="M26 10V42M10 26H42"
        stroke="#fff"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Medical Caduceus Snake Elements */}
      <path
        d="M20 16C22 18 24 20 26 18C28 20 30 18 32 16"
        stroke="#b6d7ff"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M20 36C22 34 24 32 26 34C28 32 30 34 32 36"
        stroke="#b6d7ff"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />

      {/* Small medical symbols */}
      <circle cx="19" cy="19" r="2" fill="#b6d7ff" />
      <circle cx="33" cy="19" r="2" fill="#b6d7ff" />
      <circle cx="19" cy="33" r="2" fill="#b6d7ff" />
      <circle cx="33" cy="33" r="2" fill="#b6d7ff" />

      <defs>
        <linearGradient
          id="paint0_linear"
          x1={10}
          y1="10"
          x2={42}
          y2="42"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0} stopColor="#0d6efd" />
          <stop offset={1} stopColor="#4a90e2" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Nav1;
