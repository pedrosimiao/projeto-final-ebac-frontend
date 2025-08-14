// src/pages/Feed/index.tsx

import { RefObject, useRef } from "react";

import Sidebar from "../../components/Sidebar";
import FeedContent from "../../components/FeedContent";
import RightSidebar from "../../components/RightSidebar";

import { PageContainer } from "./styles";

const Feed = () => {
  // ref para o PageContainer
  const pageScrollRef: RefObject<HTMLDivElement | null> = useRef(null);

  // PageContainer -> elemento 'root' que o IntersectionObserver
  // em PostList e CommentList vai monitorar para rolagem.
  return (
    <PageContainer ref={pageScrollRef}>
      <Sidebar />
      <FeedContent pageScrollRef={pageScrollRef} />
      <RightSidebar />
    </PageContainer>
  );
};

export default Feed;
