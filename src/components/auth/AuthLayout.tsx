import React from "react";
import AuthSideInfo from "./AuthSideInfo";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="h-screen flex flex-col md:flex-row">
      {/* Side Info (hidden on mobile) */}
      <div className="hidden md:flex md:max-w-1/2 bg-primary-foreground items-center justify-center">
        <AuthSideInfo />
      </div>
      {/* Form Area */}
      <div className="flex flex-1 justify-center p-6 h-screen overflow-auto">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
