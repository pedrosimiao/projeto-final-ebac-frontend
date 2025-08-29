// src/pages/Feed/Status/index.tsx

import { useState, useEffect, RefObject } from "react";
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
import { IComment } from "../../../types";

interface OutletContext {
  pageScrollRef: RefObject<HTMLDivElement | null>;
}

const StatusPage = () => {
  const { postId } = useParams<{ postId?: string }>();
  const back = useNavigateBack();
  const { pageScrollRef } = useOutletContext<OutletContext>();
  const queryClient = useQueryClient();

  const [comments, setComments] = useState<IComment[]>([]);
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

  useEffect(() => {
    if (rootComments) {
      setComments(rootComments);
      setExpandedComments(new Set());
    }
  }, [rootComments]);

  const handleToggleReplies = async (commentId: string) => {
    const isExpanded = expandedComments.has(commentId);

    setExpandedComments(prev => {
      const newExpanded = new Set(prev);
      if (isExpanded) {
        newExpanded.delete(commentId);
      } else {
        newExpanded.add(commentId);
      }
      return newExpanded;
    });

    if (!isExpanded) {
      try {
        const repliesData = await queryClient.fetchQuery({
          queryKey: ['comments', 'repliesList', commentId],
          queryFn: () => fetchRepliesToCommentRequest(commentId),
        });

        const replies = repliesData?.data?.results || [];

        if (replies.length > 0) {
          setComments(prev => {
            const newComments = [...prev];
            const parentIndex = newComments.findIndex(c => c.id === commentId);

            if (parentIndex !== -1) {
              const repliesToRemove = newComments.filter(c => c.parent_comment?.id === commentId);
              const repliesCount = repliesToRemove.length;
              newComments.splice(parentIndex + 1, repliesCount, ...replies);
            }
            return newComments;
          });
        }
      } catch (error) {
        console.error("Failed to fetch replies:", error);
      }
    } else {
      setComments(prev => prev.filter(c => c.parent_comment?.id !== commentId));
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
          comments={comments}
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






































// import { useMemo, RefObject } from "react";
// import { useParams, useLocation, useOutletContext } from "react-router-dom";

// import { useNavigateBack } from "../../../hooks/useNavigateBack";

// import FeedHeader from "../../../components/FeedHeader";
// import PostDetailCard from "../../../components/PostDetailCard";
// import CommentDetailCard from "../../../components/CommentDetailCard";
// import ReplyInput from "../../../components/ReplyInput";
// import CommentList from "../../../components/CommentList";

// import { useSinglePost } from "../../../hooks/usePosts";
// import {
//   useInfiniteRootComments,
//   useSingleComment,
//   useInfiniteRepliesToComment,
// } from "../../../hooks/useComments";

// import { FaArrowLeft } from "react-icons/fa";

// import { FeedHeaderTextContent, BackLink } from "../../../components/FeedHeader/styles";
// import { StatusContainer } from "./styles";
// import { IComment } from "../../../types";

// interface OutletContext {
//   pageScrollRef: RefObject<HTMLDivElement | null>;
// }

// const StatusPage = () => {
//   const { postId, commentId } = useParams<{ postId?: string; commentId?: string }>();
//   const location = useLocation();
//   const back = useNavigateBack();

//   const { pageScrollRef } = useOutletContext<OutletContext>();

//   console.log("StatusPage - pageScrollRef from Outlet:", pageScrollRef);

//   const isPostRoute = location.pathname.includes("/status/post/");
//   const isCommentRoute = location.pathname.includes("/status/comment/");


//   const {
//     post: currentPost,
//     isLoading: isPostLoading,
//     isError: isPostError,
//     error: postError,
//   } = useSinglePost(isPostRoute ? postId : undefined);

//   const {
//     rootComments,
//     isLoading: isRootCommentsLoading,
//     isError: isRootCommentsError,
//     error: rootCommentsError,
//     fetchNextPage: fetchNextRootCommentsPage,
//     hasNextPage: hasNextRootCommentsPage,
//     isFetchingNextPage: isFetchingNextRootCommentsPage,
//   } = useInfiniteRootComments(isPostRoute ? postId : undefined);

//   const {
//     replies,
//     isLoading: isRepliesLoading,
//     isError: isRepliesError,
//     error: repliesError,
//     fetchNextPage: fetchNextRepliesPage,
//     hasNextPage: hasNextRepliesPage,
//     isFetchingNextPage: isFetchingNextRepliesPage,
//   } = useInfiniteRepliesToComment(isCommentRoute ? commentId : undefined);


//   const {
//     singleComment: currentComment,
//     isLoading: isSingleCommentLoading,
//     isError: isSingleCommentError,
//     error: singleCommentError,
//   } = useSingleComment(isCommentRoute ? commentId : undefined);

//   const {
//     post: postOfComment,
//     isLoading: isPostOfCommentLoading,
//     isError: isPostOfCommentError,
//     error: postOfCommentError,
//   } = useSinglePost(isCommentRoute && currentComment ? currentComment.post_id : undefined);


//   const commentsToDisplay: IComment[] = useMemo(() => {
//     if (isPostRoute && rootComments) {
//       return rootComments
//     } else if (isCommentRoute && replies) {
//       return replies;
//     }
//     return [];
//   }, [isPostRoute, rootComments, isCommentRoute, replies]);



//   const isLoading =
//     (isPostRoute && (isPostLoading || isRootCommentsLoading)) ||
//     (isCommentRoute && (isSingleCommentLoading || isPostOfCommentLoading || isRepliesLoading));

//   const contentFound =
//     (isPostRoute && currentPost) || (isCommentRoute && currentComment);

//   const error =
//     (isPostRoute && isPostError && postError?.message) ||
//     (isPostRoute && isRootCommentsError && rootCommentsError?.message) ||
//     (isCommentRoute && isSingleCommentError && singleCommentError?.message) ||
//     (isCommentRoute && isPostOfCommentError && postOfCommentError?.message) ||
//     (isCommentRoute && isRepliesError && repliesError?.message) ||
//     null;

//   if (error) {
//     return (
//       <StatusContainer>
//         <FeedHeader>
//           <BackLink to={back}>
//             <FaArrowLeft />
//           </BackLink>
//           <FeedHeaderTextContent>
//             <h1>Loading error: {error}</h1>
//           </FeedHeaderTextContent>
//         </FeedHeader>
//       </StatusContainer>
//     );
//   }

//   if (isLoading) {
//     return (
//       <StatusContainer>
//         <FeedHeader>
//           <BackLink to={back}>
//             <FaArrowLeft />
//           </BackLink>
//           <FeedHeaderTextContent>
//             <h1>Loading content...</h1>
//           </FeedHeaderTextContent>
//         </FeedHeader>
//       </StatusContainer>
//     );
//   }

//   if (!contentFound) {
//     return (
//       <StatusContainer>
//         <FeedHeader>
//           <BackLink to={back}>
//             <FaArrowLeft />
//           </BackLink>
//           <FeedHeaderTextContent>
//             <h1>Content not found :(</h1>
//           </FeedHeaderTextContent>
//         </FeedHeader>
//       </StatusContainer>
//     );
//   }

//   return (
//     <>
//       <FeedHeader>
//         <BackLink to={back}>
//           <FaArrowLeft />
//         </BackLink>
//         <FeedHeaderTextContent>
//           <h1>{isPostRoute ? "Post" : "Comment"}</h1>
//         </FeedHeaderTextContent>
//       </FeedHeader>
//       <StatusContainer>
//         {/* Post */}
//         {isPostRoute && currentPost && (
//           <>
//             <PostDetailCard post={currentPost} />
//             <ReplyInput postId={currentPost.id} />
//             <CommentList
//               comments={commentsToDisplay}
//               contextCommentId={null}
//               pageScrollRef={pageScrollRef} // ref do root do observer

//               // props de paginação para comments raíz
//               fetchNextPage={fetchNextRootCommentsPage}
//               hasNextPage={hasNextRootCommentsPage}
//               isFetchingNextPage={isFetchingNextRootCommentsPage}
//               isLoading={isRootCommentsLoading}
//               isError={isRootCommentsError}
//               error={rootCommentsError}
//             />
//           </>
//         )}

//         {/* Comment */}
//         {isCommentRoute && currentComment && (
//           <>
//             <CommentDetailCard
//               comment={currentComment}
//               postAuthorUsername={postOfComment?.user?.username}
//             />
//             <div id="reply-input">
//               <ReplyInput parentComment={currentComment} postId={currentComment.post_id} />
//             </div>
//             <CommentList
//               comments={commentsToDisplay}
//               contextCommentId={currentComment.id}
//               pageScrollRef={pageScrollRef} // <-- ref do root do observer

//               // props de paginação para replies
//               fetchNextPage={fetchNextRepliesPage}
//               hasNextPage={hasNextRepliesPage}
//               isFetchingNextPage={isFetchingNextRepliesPage}
//               isLoading={isRepliesLoading}
//               isError={isRepliesError}
//               error={repliesError}
//             />
//           </>
//         )}
//       </StatusContainer>
//     </>
//   );
// };

// export default StatusPage;
