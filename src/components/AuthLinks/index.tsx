// src/components/AuthLinks/index.tsx

import { useLocation, Link } from "react-router-dom";
import AuthLinksContainer from "./styles";

const AuthLinks = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <AuthLinksContainer>
      {currentPath === "/login" ? (
        <>
          <Link to="/welcome">Welcome</Link>
          <span>|</span>
          <Link to="/signup">Sign up</Link>
        </>
      ) : currentPath === "/signup" ? (
        <>
          <Link to="/login">Login</Link>
          <span>|</span>
          <Link to="/">Welcome</Link>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <span>|</span>
          <Link to="/signup">Sign up</Link>
        </>
      )}
    </AuthLinksContainer>
  );
};

export default AuthLinks;
