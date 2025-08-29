// src/pages/Feed/Status/index.tsx

import { useState, RefObject } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { useNavigateBack } from "../../../hooks/useNavigateBack";

import FeedHeader from "../../../components/FeedHeader";
import PostDetailCard from "../../../components/PostDetailCard";
import ReplyInput from "../../../components/ReplyInput";
import CommentList from "../../../components/CommentList";

import { useSinglePost } from "../../../hooks/usePosts";
import { useInfiniteRootComments } from "../../../hooks/useComments";

import { fetchRepliesToCommentRequest } from "../../../api/commentApi";

import { FaArrowLeft } from "react-icons/fa";

import { FeedHeaderTextContent, BackLink } from "../../../components/FeedHeader/styles";
import { StatusContainer } from "./styles";
import { IComment, IPaginatedResponse } from "../../../types";

interface OutletContext {
  pageScrollRef: RefObject<HTMLDivElement | null>;
}

const StatusPage = () => {
  const { postId } = useParams<{ postId?: string }>();
  const back = useNavigateBack();
  const { pageScrollRef } = useOutletContext<OutletContext>();
  const queryClient = useQueryClient();

  // manter registro dos comentários que estão expandidos
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

  const {
    rootComments,
    isLoading: isRootCommentsLoading,
    isError: isRootCommentsError,
    error: rootCommentsError,
    fetchNextPage: fetchNextRootCommentsPage,
    hasNextPage: hasNextRootCommentsPage,
    isFetchingNextPage: isFetchingNextRootCommentsPage,
  } = useInfiniteRootComments(postId);

  const {
    post: currentPost,
    isLoading: isPostLoading,
    isError: isPostError,
    error: postError,
  } = useSinglePost(postId);

  const allComments = (rootComments || [])
    .flatMap((comment: IComment) => {
      const cachedReplies = expandedComments.has(comment.id)
        ? queryClient.getQueryData<IPaginatedResponse<IComment[]>>(['comments', 'repliesList', comment.id])
        : undefined;

      const replies = cachedReplies?.results || [];

      return [comment, ...replies];
    });

  const handleToggleReplies = async (commentId: string) => {
    const isExpanded = expandedComments.has(commentId);

    if (!isExpanded) {
      try {
        await queryClient.fetchQuery({
          queryKey: ['comments', 'repliesList', commentId],
          queryFn: () => fetchRepliesToCommentRequest(commentId),
        });

        setExpandedComments(prev => new Set(prev).add(commentId));
      } catch (error) {
        console.error("Failed to fetch replies:", error);
      }
    } else {
      setExpandedComments(prev => {
        const newExpanded = new Set(prev);
        newExpanded.delete(commentId);
        return newExpanded;
      });
    }
  };

  const isLoading = isPostLoading || isRootCommentsLoading;
  const contentFound = !!currentPost;
  const error = (isPostError && postError?.message) || (isRootCommentsError && rootCommentsError?.message) || null;

  if (error) {
    return (
      <StatusContainer>
        <FeedHeader>
          <BackLink to={back}>
            <FaArrowLeft />
          </BackLink>
          <FeedHeaderTextContent>
            <h1>Loading error: {error}</h1>
          </FeedHeaderTextContent>
        </FeedHeader>
      </StatusContainer>
    );
  }

  if (isLoading) {
    return (
      <StatusContainer>
        <FeedHeader>
          <BackLink to={back}>
            <FaArrowLeft />
          </BackLink>
          <FeedHeaderTextContent>
            <h1>Loading content...</h1>
          </FeedHeaderTextContent>
        </FeedHeader>
      </StatusContainer>
    );
  }

  if (!contentFound) {
    return (
      <StatusContainer>
        <FeedHeader>
          <BackLink to={back}>
            <FaArrowLeft />
          </BackLink>
          <FeedHeaderTextContent>
            <h1>Content not found :(</h1>
          </FeedHeaderTextContent>
        </FeedHeader>
      </StatusContainer>
    );
  }

  return (
    <>
      <FeedHeader>
        <BackLink to={back}>
          <FaArrowLeft />
        </BackLink>
        <FeedHeaderTextContent>
          <h1>Post</h1>
        </FeedHeaderTextContent>
      </FeedHeader>
      <StatusContainer>
        <PostDetailCard post={currentPost} />
        <ReplyInput postId={currentPost.id} />
        <CommentList
          comments={allComments}
          pageScrollRef={pageScrollRef}
          fetchNextPage={fetchNextRootCommentsPage}
          hasNextPage={hasNextRootCommentsPage}
          isFetchingNextPage={isFetchingNextRootCommentsPage}
          isLoading={isRootCommentsLoading}
          isError={isRootCommentsError}
          error={rootCommentsError}
          onToggleReplies={handleToggleReplies}
          expandedComments={expandedComments}
        />
      </StatusContainer>
    </>
  );
};

export default StatusPage;
