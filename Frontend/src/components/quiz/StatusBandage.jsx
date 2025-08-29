import React from "react";

const StatusBandage = ({ statusName, status, className }) => {
  return (
    <div className={`px-4 py-1.5 rounded-full font-bold ${className}`}>
      <span>{statusName}: </span>
      <span>{status}</span>
    </div>
  );
};

export default StatusBandage;
