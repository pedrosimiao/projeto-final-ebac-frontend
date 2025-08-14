// src/components/AuthLayout/index.tsx

import React from "react";
import { PageContainer, ContentContainer, AnimatedContent } from "./styles";
import Logo from "../Logo";
import AuthLinks from "../AuthLinks";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <PageContainer>
      <AuthLinks />
      <ContentContainer>
        <Logo />
        <AnimatedContent
          key={window.location.pathname}
          initial={{ opacity: 0, x: 150 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -150 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </AnimatedContent>
      </ContentContainer>
    </PageContainer>
  );
};

export default AuthLayout;
