// src/pages/Welcome/index.tsx

import AuthLayout from "../../components/AuthLayout";
import { SpecialText, Author, PoemContainer } from "./styles";

const Welcome = () => {
  return (
    <AuthLayout>
      <PoemContainer>
        <SpecialText>
          "Draw a crazy picture,
          <br />
          Write a nutty poem,
          <br />
          Sing a mumble-grumble song,
          <br />
          Whistle through your comb.
          <br />
          Do a loony-goony dance
          <br />
          'Cross the kitchen floor,
          <br />
          Put something silly in the world
          <br />
          That ain't been there before."
        </SpecialText>
        <Author>- Shel Silverstein</Author>
      </PoemContainer>
    </AuthLayout>
  );
};

export default Welcome;
