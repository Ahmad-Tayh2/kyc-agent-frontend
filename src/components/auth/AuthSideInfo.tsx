import React from "react";
import authBg from "@/assets/images/auth-bg.png";
const AuthSideInfo: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-red-200 w-full text-white">
      {/* Placeholder for image */}
      <img src={authBg} className="h-screen" />
      {/* <div className="mb-8 w-64 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-500">Image Placeholder</span>
      </div>
      <h2 className="text-2xl font-bold mb-2">Sending Happiness Around</h2>
      <h3 className="text-2xl font-bold mb-6 text-primary">The Globe</h3>
      <p className="text-lg text-center max-w-xs">
      </p> */}
    </div>
  );
};

export default AuthSideInfo;
