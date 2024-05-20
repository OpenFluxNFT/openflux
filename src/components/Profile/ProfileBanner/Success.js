import React from "react";

const Success = ({ svgColor, bgColor }) => {
  return (
    <div className="pl-0">
      <svg
        width="18"
        height="18"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="8" cy="8" r="8" fill={bgColor} />
        <path
          d="M3.33594 8.06663L5.95609 10.6666L12.0026 4.66663"
          stroke={svgColor}
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  );
};

export default Success;
