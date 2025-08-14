// src/components/PostCardCompact/index.tsx

import { IPost } from "../../types";
import {
  CompactCard,
  CompactHeader,
  CompactAvatar,
  CompactUserInfo,
  CompactContent,
  CompactMedia,
  NestedRetweetContainer, // <--- NOVO COMPONENTE
  RetweetLabel,           // <--- NOVO COMPONENTE
} from "./styles";
import { parsePostText } from "../../utils/parsePostText";

import defaultAvatar from "../../assets/default-avatar.png";
import { FaRetweet } from "react-icons/fa"; // Certifique-se de ter este import

interface PostCardCompactProps {
  post: IPost;
  isNestedRetweet?: boolean;
}

const PostCardCompact = ({ post, isNestedRetweet }: PostCardCompactProps) => {
  if (!post) return null;

  const fullName = `${post.user.firstName} ${post.user.lastName}`;

  return (
    <CompactCard>
      <CompactHeader>
        <CompactAvatar src={post.user.profile_picture || defaultAvatar} alt={fullName} />
        <CompactUserInfo>
          <h4>{fullName}</h4>
          <small>@{post.user.username}</small>
        </CompactUserInfo>
      </CompactHeader>

      <CompactContent $isNested={isNestedRetweet}> {/* <--- Passando a prop aqui */}
        {parsePostText(post.content)}
      </CompactContent>

      {post.image && (
        <CompactMedia>
          <img src={post.image} alt="Post media" />
        </CompactMedia>
      )}

      {post.video && (
        <CompactMedia>
          <video src={post.video} controls />
        </CompactMedia>
      )}

      {/* Renderiza o post retweetado aninhado */}
      {post.retweet && !isNestedRetweet && (
        <NestedRetweetContainer>
          <RetweetLabel>
            <FaRetweet />
            Post Original
          </RetweetLabel>
          <PostCardCompact post={post.retweet} isNestedRetweet={true} /> {/* Chamada recursiva */}
        </NestedRetweetContainer>
      )}
    </CompactCard>
  );
};

export default PostCardCompact;
