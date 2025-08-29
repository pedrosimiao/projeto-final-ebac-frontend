// src/components/CommentCard/index.tsx

import { useDispatch } from "react-redux";
import { Link } from "react-router-dom"; // Não precisamos mais do useNavigate

import { AppDispatch } from "../../store/store";

import { setParentComment } from "../../store/slices/replySlice";

import { useCurrentUserProfile } from "../../hooks/useUsers";

import {
  useCommentLikesCount,
  useHasLikedComment,
  useLikeComment,
  useUnlikeComment
} from "../../hooks/useLikes"

import DeleteButton from "../DeleteButton";

import { IComment } from "../../types";

import { getTimeAgo } from "../../utils/dateUtils";

import defaultAvatar from "../../assets/default-avatar.png"

import { FaComment, FaHeart } from "react-icons/fa";

import { DeleteButtonWrapper } from "../DeleteButton/styles";

import {
  PostContainer,
  PostFooter,
  MediaWrapper,
  FooterAction,
  CommentHeader,
  CommentUserAvatar,
  CommentUserInfo,
  CommentTimestamp,
  CommentContent,
  RepliedToLabel,
  RepliedToLink,
} from "./styles";
import { ReplyViewer } from "../PostCard/styles";


interface CommentProps {
  comment: IComment;
  onToggleReplies: (commentId: string) => void;
  isExpanded: boolean;
}

const CommentCard = ({ comment, onToggleReplies, isExpanded }: CommentProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const { data: currentUser } = useCurrentUserProfile(false);
  const currentUserId = currentUser?.id;

  const fullName = `${comment.user.firstName} ${comment.user.lastName}`;
  const displayDate = comment.created_at;

  const { data: hasLiked = false } = useHasLikedComment(comment.id);
  const { data: likeCount = 0 } = useCommentLikesCount(comment.id);
  const { mutate: likeComment } = useLikeComment();
  const { mutate: unlikeComment } = useUnlikeComment();

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentUserId) {
      if (hasLiked) {
        unlikeComment(comment.id);
      } else {
        likeComment(comment.id);
      }
    }
  };

  const handleReplyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentUserId) {
      dispatch(setParentComment(comment));
      const replyInput = document.getElementById("reply-input");
      if (replyInput) {
        const headerHeight = 52;
        replyInput.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
        window.scrollBy(0, -headerHeight);
      }
    }
  }

  const handleRepliesClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleReplies(comment.id);
  };

  const repliesCount = comment.reply_count || 0;

  return (
    <PostContainer>
      <DeleteButtonWrapper>
        <DeleteButton
          authorId={comment.user.id}
          id={comment.id}
          isComment={true}
        />
      </DeleteButtonWrapper>

      <CommentUserAvatar
        src={comment.user.profile_picture || defaultAvatar}
        alt={fullName}
      />

      <CommentHeader>
        <CommentUserInfo>
          <Link to={`/${comment.user.username}`}>
            <h4>{fullName}</h4>
          </Link>
          <Link to={`/${comment.user.username}`}>
            <p>@{comment.user.username}</p>
          </Link>
          <CommentTimestamp>{getTimeAgo(displayDate)}</CommentTimestamp>
        </CommentUserInfo>
      </CommentHeader>

      {comment.parent_comment?.user && (
        <RepliedToLabel>
          replied to <RepliedToLink to={`/${comment.parent_comment.user.username}`}>@{comment.parent_comment.user.username}</RepliedToLink>
        </RepliedToLabel>
      )}

      <CommentContent>{comment.content}</CommentContent>

      {comment.image && (
        <MediaWrapper>
          <img src={comment.image} alt="Comment media" />
        </MediaWrapper>
      )}

      {comment.video && (
        <MediaWrapper>
          <video src={comment.video} controls />
        </MediaWrapper>
      )}

      <PostFooter>
        <FooterAction onClick={handleReplyClick}>
          <FaComment /> <span>{repliesCount}</span>
        </FooterAction>

        <FooterAction onClick={handleLike}>
          {hasLiked ? <FaHeart color="#E0245E" /> : <FaHeart color="inherit" />}
          <span>{likeCount}</span>
        </FooterAction>
      </PostFooter>

      <ReplyViewer>
        {repliesCount > 0 && (
          <FooterAction onClick={handleRepliesClick}>
            <span>{isExpanded ? "Hide replies" : `View all ${repliesCount} replies`}</span>
          </FooterAction>
        )}
      </ReplyViewer>
    </PostContainer>
  );
};

export default CommentCard;







































// import { useDispatch } from "react-redux";
// import { Link, useNavigate } from "react-router-dom";

// import { AppDispatch } from "../../store/store";

// import { setParentComment } from "../../store/slices/replySlice";

// import { useCurrentUserProfile } from "../../hooks/useUsers";

// import {
//   useCommentLikesCount,
//   useHasLikedComment,
//   useLikeComment,
//   useUnlikeComment
// } from "../../hooks/useLikes"

// import DeleteButton from "../DeleteButton";

// import { IComment } from "../../types";

// import { getTimeAgo } from "../../utils/dateUtils";

// import defaultAvatar from "../../assets/default-avatar.png"

// import { FaComment, FaHeart } from "react-icons/fa";

// import { DeleteButtonWrapper } from "../DeleteButton/styles";

// import {
//   PostContainer,
//   PostFooter,
//   MediaWrapper,
//   FooterAction,
//   CommentHeader,
//   CommentUserAvatar,
//   CommentUserInfo,
//   CommentTimestamp,
//   CommentContent,
//   RepliedToLabel,
//   RepliedToLink,
// } from "./styles";


// interface CommentProps {
//   comment: IComment;
//   contextCommentId?: string | null;
// }


// const Comment = ({ comment, contextCommentId }: CommentProps) => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch<AppDispatch>();

//   const { data: currentUser } = useCurrentUserProfile(false);
//   const currentUserId = currentUser?.id;

//   const fullName = `${comment.user.firstName} ${comment.user.lastName}`;
//   const displayDate = comment.created_at;

//   const { data: hasLiked = false } = useHasLikedComment(comment.id);
//   const { data: likeCount = 0 } = useCommentLikesCount(comment.id);
//   const { mutate: likeComment } = useLikeComment();
//   const { mutate: unlikeComment } = useUnlikeComment();

//   const handleLike = () => {
//     if (currentUserId) {
//       if (hasLiked) {
//         unlikeComment(comment.id)
//       } else {
//         likeComment(comment.id)
//       }
//     }
//   };

//   const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
//     const target = e.target as HTMLElement;

//     if (
//       target.closest("a") ||
//       target.closest("button") ||
//       target.closest("svg") ||
//       target.closest("img") ||
//       target.closest("video") ||
//       target.tagName === "A" ||
//       target.tagName === "BUTTON"
//     ) {
//       return;
//     }

//     navigate(`/status/comment/${comment.id}`);
//   };

//   const handleReplyClick = (e: React.MouseEvent) => {
//     e.stopPropagation();

//     if (currentUserId) {
//       dispatch(setParentComment(comment));

//       const replyInput = document.getElementById("reply-input");
//       if (replyInput) {
//         const headerHeight = 52; // Supondo uma altura de header fixa

//         replyInput.scrollIntoView({
//           behavior: "smooth",
//           block: "start",
//           inline: "nearest",
//         });

//         window.scrollBy(0, -headerHeight);
//       }
//     }
//   }

//   const repliesCount = comment.reply_count || 0;

//   return (
//     <PostContainer onClick={handleContainerClick}>
//       <DeleteButtonWrapper>
//         <DeleteButton
//           authorId={comment.user.id}
//           id={comment.id}
//           isComment={true}
//         />
//       </DeleteButtonWrapper>

//       <CommentUserAvatar
//         src={comment.user.profile_picture || defaultAvatar}
//         alt={fullName}
//       />

//       <CommentHeader>
//         <CommentUserInfo>
//           <Link to={`/${comment.user.username}`}>
//             <h4>{fullName}</h4>
//           </Link>
//           <Link to={`/${comment.user.username}`}>
//             <p>@{comment.user.username}</p>
//           </Link>
//           <CommentTimestamp>{getTimeAgo(displayDate)}</CommentTimestamp>
//         </CommentUserInfo>
//       </CommentHeader>

//       {comment.parent_comment?.user &&
//       comment.parent_comment.id !== contextCommentId && (
//         <RepliedToLabel>
//           replied to <RepliedToLink to={`/${comment.parent_comment.user.username}`}>@{comment.parent_comment.user.username}</RepliedToLink>
//         </RepliedToLabel>
//       )}

//       <CommentContent>{comment.content}</CommentContent>

//       {comment.image && (
//         <MediaWrapper>
//           <img src={comment.image} alt="Comment media" />
//         </MediaWrapper>
//       )}

//       {comment.video && (
//         <MediaWrapper>
//           <video src={comment.video} controls />
//         </MediaWrapper>
//       )}

//       <PostFooter>
//         <FooterAction onClick={handleReplyClick}>
//           {" "}
//           <FaComment /> <span>{repliesCount}</span>
//         </FooterAction>

//         <FooterAction onClick={handleLike}>
//           {hasLiked ? <FaHeart color="#E0245E" /> : <FaHeart color="inherit"/>}
//           <span>{likeCount}</span>
//         </FooterAction>
//       </PostFooter>
//     </PostContainer>
//   );
// };

// export default Comment;
