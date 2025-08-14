// src/pages/Feed/Home/index.tsx

import { RefObject, useState } from "react";
import { useOutletContext } from "react-router-dom";

import { FeedSelector } from "../../../components/FeedHeader/styles";
import FeedHeader from "../../../components/FeedHeader";
import PostInput from "../../../components/PostInput";
import PostList, { PostListMode } from "../../../components/PostList";

import HomeContainer from "./styles";

interface OutletContextType {
  pageScrollRef: RefObject<HTMLDivElement | null>;
}

const Home = () => {
  const [mode, setMode] = useState<PostListMode>("forYou");

  const { pageScrollRef } = useOutletContext<OutletContextType>()

  return (
    <HomeContainer>
      <FeedHeader noPadding={true}>
        <FeedSelector selected={mode === "forYou"} onClick={() => setMode("forYou")}>
          <span>For you</span>
        </FeedSelector>
        <FeedSelector selected={mode === "following"} onClick={() => setMode("following")}>
          <span>Following</span>
        </FeedSelector>
      </FeedHeader>

      {mode === "forYou" && (
        <div id="post-input">
          <PostInput />
        </div>
      )}

      <PostList mode={mode} pageScrollRef={pageScrollRef}/>
    </HomeContainer>
  );
};

export default Home;
