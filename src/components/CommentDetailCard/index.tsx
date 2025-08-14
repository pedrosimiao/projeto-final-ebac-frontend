// src/components/CommentDetailCard/index.tsx

import { Link } from "react-router-dom";

import { useCurrentUserProfile } from "../../hooks/useUsers";

import {
  useCommentLikesCount,
  useHasLikedComment,
  useLikeComment,
  useUnlikeComment
} from "../../hooks/useLikes"

import DeleteButton from "../DeleteButton";

import { IComment } from "../../types";

import { formatDate } from "../../utils/dateUtils";
import { parsePostText } from "../../utils/parsePostText";

import defaultAvatar from "../../assets/default-avatar.png"

import { DeleteButtonWrapper } from "../DeleteButton/styles";

import {
  PostContainer,
  PostHeader,
  MediaWrapper,
  PostFooter,
  FooterAction,
  FullCommentUserAvatar,
  FullCommentUserInfo,
  FullCommentContent,
  FullCommentTimestamp,
  RepliedToLabel,
  RepliedToLink,
} from "./styles";

import { FaComment, FaHeart } from "react-icons/fa";

interface CommentDetailCardProps {
  comment: IComment;
  postAuthorUsername?: string;
}


const CommentDetailCard = ({ comment, postAuthorUsername }: CommentDetailCardProps) => {

  const { data: currentUser } = useCurrentUserProfile(false);
  const currentUserId = currentUser?.id;

  const fullName = `${comment.user.firstName} ${comment.user.lastName}`;
  const formattedDate = formatDate(comment.created_at, "h:mm a '•' MMMM d, yyyy");

  const { data: hasLiked = false } = useHasLikedComment(comment.id);
  const { data: likeCount = 0 } = useCommentLikesCount(comment.id);
  const { mutate: likeComment } = useLikeComment();
  const { mutate: unlikeComment } = useUnlikeComment();

  const handleLike = () => {
    if (currentUserId) {
      if (hasLiked) {
        unlikeComment(comment.id)
      } else {
        likeComment(comment.id)
      }
    }
  };

  const repliesCount = comment.reply_count || 0;

  return (
    <PostContainer>
      <DeleteButtonWrapper>
        <DeleteButton
          authorId={comment.user.id}
          id={comment.id}
          isComment={false}
        />
      </DeleteButtonWrapper>

      <PostHeader>
        <FullCommentUserAvatar
          src={comment.user.profile_picture || defaultAvatar}
          alt={fullName}
        />
        <FullCommentUserInfo>
          <Link to={`/${comment.user.username}`}>
            <h4>{fullName}</h4>
          </Link>
          <Link to={`/${comment.user.username}`}>
            <p>@{comment.user.username}</p>
          </Link>
        </FullCommentUserInfo>
      </PostHeader>

      {comment.parent_comment?.user ? (
        <RepliedToLabel>
          replied to{" "}
          <RepliedToLink to={`/${comment.parent_comment.user.username}`}>
            @{comment.parent_comment.user.username}
          </RepliedToLink>
        </RepliedToLabel>
      ) : postAuthorUsername ? (
        <RepliedToLabel>
          replied to{" "}
          <RepliedToLink to={`/${postAuthorUsername}`}>
            @{postAuthorUsername}
          </RepliedToLink>
        </RepliedToLabel>
      ) : null}

      {comment.content && <FullCommentContent>{parsePostText(comment.content)}</FullCommentContent>}

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

      <FullCommentTimestamp>{formattedDate}</FullCommentTimestamp>

      <PostFooter>
        <FooterAction>
          <FaComment /> <span>{repliesCount}</span>
        </FooterAction>

        <FooterAction onClick={handleLike}>
          {hasLiked ? <FaHeart color="#E0245E" /> : <FaHeart color="inherit"/>}
          <span>{likeCount}</span>
        </FooterAction>
      </PostFooter>
    </PostContainer>
  );
};

export default CommentDetailCard;
