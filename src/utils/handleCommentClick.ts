// src/utils/handleCommentClick.ts

import { NavigateFunction } from "react-router-dom";

export interface HandleCommentClickParams {
  postId: string;
  isMobile: boolean;
  locationPathname: string;
  navigate: NavigateFunction;
  scrollToInput?: () => void;
}

export function handleCommentClick({
  postId,
  isMobile,
  locationPathname,
  navigate,
  scrollToInput,
}: HandleCommentClickParams) {
  const isHome = locationPathname === "/home";
  const isProfile = locationPathname.startsWith("/profile");
  const isStatusPage = locationPathname.startsWith("/status/");

  if (isProfile) {
    navigate(`/status/${postId}`);
  } else if (isStatusPage) {
    scrollToInput?.(); // Executa scrollIntoView do ReplyInput
  } else if (isHome) {
    if (isMobile) {
      scrollToInput?.(); // Scrolla até PostInput com label de reply
    } else {
      navigate(`/compose/reply/${postId}`, {
        state: { backgroundLocation: locationPathname },
      });
    }
  }
}
