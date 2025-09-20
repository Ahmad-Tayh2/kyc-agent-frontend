import React from "react";
import authBg from "@/assets/images/auth-bg.png";
const AuthSideInfo: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full text-white">
      <img src={authBg} className="h-screen" />
    </div>
  );
};

export default AuthSideInfo;
