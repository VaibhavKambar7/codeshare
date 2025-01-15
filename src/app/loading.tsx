import React from "react";
import { PiSpinnerBold } from "react-icons/pi";

const loading = () => {
  return (
    <div className="bg-[#1f1e1e]">
      <div className="absolute inset-0 flex items-center justify-center bg-[#2b2a2a]">
        <PiSpinnerBold className="animate-spin text-4xl text-[#d1d1db]" />
      </div>
    </div>
  );
};

export default loading;
