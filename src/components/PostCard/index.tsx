// src/components/PostCard/index.tsx

import { MouseEvent } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { AppDispatch } from "../../store/store";

import { setRetweetPost } from "../../store/slices/retweetSlice";

import {
  usePostLikesCount,
  useHasLikedPost,
  useLikePost,
  useUnlikePost
} from "../../hooks/useLikes"

import { useCurrentUserProfile } from "../../hooks/useUsers";

import { IPost } from "../../types";

import DeleteButton from "../DeleteButton";

import { getTimeAgo } from "../../utils/dateUtils";
import { parsePostText } from "../../utils/parsePostText";

import defaultAvatar from "../../assets/default-avatar.png"

import { DeleteButtonWrapper } from "../DeleteButton/styles";

import {
  PostContainer,
  PostHeader,
  PostUserInfo,
  PostTimestamp,
  PostContent,
  MediaWrapper,
  PostFooter,
  FooterAction,
  RetweetContainer,
  RetweetLabel,
  UserAvatar,
} from "./styles";

import { FaComment, FaHeart, FaRetweet } from "react-icons/fa";

interface PostProps {
  post: IPost;
  isRetweet?: boolean;
}

const Post = ({ post, isRetweet }: PostProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const { data: currentUser } = useCurrentUserProfile(false);
  const currentUserId = currentUser?.id;

  const { data: hasLiked = false } = useHasLikedPost(post.id);
  const { data: likeCount = 0 } = usePostLikesCount(post.id);
  const { mutate: likePost } = useLikePost();
  const { mutate: unlikePost } = useUnlikePost();

  const fullName = `${post.user.firstName} ${post.user.lastName}`;
  const hasContent = !!post.content;
  const displayDate = post.created_at;

  const commentsCount = post.total_comments_count || 0;

  const handleLike = () => {
    if (currentUserId) {
      if (hasLiked) {
        unlikePost(post.id)
      } else {
        likePost(post.id)
      }
    }
  };

  const handleCommentClick = () => {
    navigate(`/compose/reply/${post.id}`, {
      state: { background: location },
    });
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

    navigate(`/status/post/${post.id}`);
  };

  return (
    <PostContainer $isRetweet={isRetweet} onClick={handleContainerClick}>
      <DeleteButtonWrapper>
        <DeleteButton
          authorId={post.user.id}
          id={post.id}
          isComment={false}
        />
      </DeleteButtonWrapper>

      {post.retweet && (
        <RetweetLabel>
          <FaRetweet /> <strong>{fullName}</strong>retweeted
        </RetweetLabel>
      )}

      <div style={{position: "relative"}}>
        <PostHeader>
          <UserAvatar src={post.user.profile_picture || defaultAvatar} alt={fullName} />
          <PostUserInfo $hasContent={hasContent}>
            <Link to={`/${post.user.username}`}>
              <h4>{fullName}</h4>
            </Link>
            <Link to={`/${post.user.username}`}>
              <p>@{post.user.username}</p>
            </Link>
            <PostTimestamp>{getTimeAgo(displayDate)}</PostTimestamp>
          </PostUserInfo>
        </PostHeader>

        {hasContent && <PostContent>{parsePostText(post.content)}</PostContent>}
      </div>

      {post.retweet && (
        <RetweetContainer>
          <Post post={post.retweet} isRetweet={true} />
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

      {!isRetweet && (
        <PostFooter>
          <FooterAction
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleCommentClick();
            }}
          >
            <FaComment /> <span>{commentsCount}</span>{" "}
          </FooterAction>

          <FooterAction onClick={handleLike}>
            {hasLiked ? <FaHeart color="#E0245E" /> : <FaHeart color="inherit" />}
            <span>{likeCount}</span>
          </FooterAction>

          {!post.retweet && (
            <FooterAction
              onClick={(e) => {
                e.stopPropagation();
                dispatch(setRetweetPost(post));

                const postInput = document.getElementById("post-input");
                if (postInput) {
                  const headerHeight = 52;

                  postInput.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                    inline: "nearest",
                  });


                  window.scrollBy(0, -headerHeight);
                }
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

export default Post;
