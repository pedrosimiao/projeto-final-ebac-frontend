// src/components/Logo/index.tsx

import LogoImage from "./styles";
import { LogoProps } from "./styles";
import logoSrc from "../../assets/logo.png";

const Logo = ({ width, height }: LogoProps) => {
  return <LogoImage src={logoSrc} alt={"Put Something In"} width={width} height={height} />;
};

export default Logo;
