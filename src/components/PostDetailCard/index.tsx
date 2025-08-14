// src/components/PostDetailCard/index.tsx

import { MouseEvent } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { AppDispatch } from "../../store/store";

import { setRetweetPost } from "../../store/slices/retweetSlice";

import {
  usePostLikesCount,
  useHasLikedPost,
  useLikePost,
  useUnlikePost
} from "../../hooks/useLikes"

import { useCurrentUserProfile } from "../../hooks/useUsers";

import DeleteButton from "../DeleteButton";

import { IPost } from "../../types";

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
  RetweetContainer,
  RetweetLabel,
  FullPostUserInfo,
  FullPostTimestamp,
  FullPostContent,
  FullPostUserAvatar,
} from "./styles";

import { FaComment, FaHeart, FaRetweet } from "react-icons/fa";

interface PostProps {
  post: IPost;
  isRetweet?: boolean;
}

const PostDetailCard = ({ post, isRetweet }: PostProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { data: currentUser } = useCurrentUserProfile(false);
  const currentUserId = currentUser?.id;

  const { data: hasLiked = false } = useHasLikedPost(post.id);
  const { data: likeCount = 0 } = usePostLikesCount(post.id);
  const { mutate: likePost } = useLikePost();
  const { mutate: unlikePost } = useUnlikePost();

  const fullName = `${post.user.firstName} ${post.user.lastName}`;
  const displayDate = post.created_at;

  const commentsCount = post.total_comments_count || 0;

  const formattedPostDate = formatDate(displayDate, "h:mm a '•' MMMM d, yyyy");

  const handleLike = () => {
    if (currentUserId) {
      if (hasLiked) {
        unlikePost(post.id)
      } else {
        likePost(post.id)
      }
    }
    console.log("dispatching like. postId:", post.id, "hasLiked:", hasLiked);
  };

  const handleContainerClick = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;

    if (
      target.closest("a") ||
      target.closest("button") ||
      target.closest("svg") ||
      target.closest("img") ||
      target.closest("video") ||
      target.tagName === "A" ||
      target.tagName === "BUTTON"
    ) {
      return;
    }

    e.stopPropagation();
    if (post.retweet) {
      navigate(`/status/post/${post.retweet.id}`);
    }
  };

  return (
    <PostContainer $isRetweet={isRetweet} $forceHover={!!isRetweet}>
      <DeleteButtonWrapper>
        <DeleteButton
          authorId={post.user.id}
          id={post.id}
          isComment={false}
        />
      </DeleteButtonWrapper>

      {post.retweet && !isRetweet && (
        <RetweetLabel>
          <FaRetweet /> <strong>{fullName}</strong> retweeted
        </RetweetLabel>
      )}

      <div style={{ position: "relative" }}>
        <PostHeader>
          <FullPostUserAvatar
            src={post.user.profile_picture || defaultAvatar}
            alt={fullName}
          />
          <FullPostUserInfo>
            <Link to={`/${post.user.username}`}>
              <h4>{fullName}</h4>
            </Link>
            <Link to={`/${post.user.username}`}>
              <p>@{post.user.username}</p>
            </Link>
          </FullPostUserInfo>
        </PostHeader>

        <FullPostContent>{parsePostText(post.content)}</FullPostContent>
      </div>

      {post.retweet && (
        <RetweetContainer onClick={handleContainerClick}>
          <PostDetailCard post={post.retweet} isRetweet={true} />
        </RetweetContainer>
      )}


      {post.image && (
        <MediaWrapper $isRetweet={isRetweet}>
          <img src={post.image} alt="Post media" />
        </MediaWrapper>
      )}

      {post.video && (
        <MediaWrapper $isRetweet={isRetweet}>
          <video src={post.video} controls />
        </MediaWrapper>
      )}

      <FullPostTimestamp>{formattedPostDate}</FullPostTimestamp>

      {!isRetweet && (
        <PostFooter>
          <FooterAction>
            <FaComment /> <span>{commentsCount}</span>{" "}
            {/* Futuro link para versão overlay de postagem */}
          </FooterAction>

          <FooterAction onClick={handleLike}>
            {hasLiked ? <FaHeart color="#E0245E" /> : <FaHeart color="inherit" />}
            <span>{likeCount}</span>
          </FooterAction>

          {!post.retweet && (
            <FooterAction
              onClick={(e) => {
                e.stopPropagation(); // Evita navegação
                dispatch(setRetweetPost(post));
                // Aqui, abre um modal/overlay ou rola até um PostInput
              }}
            >
              <FaRetweet />
            </FooterAction>
          )}
        </PostFooter>
      )}
    </PostContainer>
  );
};

export default PostDetailCard;
