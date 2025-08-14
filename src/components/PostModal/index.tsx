// src/components/PostModal/index.tsx

import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import { useSinglePost } from "../../hooks/usePosts"

import { clearParentComment } from "../../store/slices/replySlice";


import PostInput from "../PostInput";
import ReplyInput from "../ReplyInput";
import PostCardCompact from "../PostCardCompact";

import { ModalContainer, ModalContent, CloseButton } from "./styles";

interface PostModalProps {
  mode: "post" | "reply";
}

const PostModal = ({ mode }: PostModalProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { postId } = useParams();

  const { post, isLoading, isError } = useSinglePost(postId || "");

  const handlePostSuccess = (id: string, type: 'post' | 'comment') => {
    dispatch(clearParentComment());

    if (type === 'post') {
      navigate(`/status/post/${id}`);

    } else if (type === 'comment') {
      navigate(`/status/post/${postId}`);
    }
  };

  const handleClose = () => {
    dispatch(clearParentComment());
    navigate(-1);
  };

  if (mode === "reply" && !postId) return null;

  if (mode === "reply") {
    if (isLoading) {
      return (
        <ModalContainer>
          <ModalContent>
            <p>Loading post...</p>
          </ModalContent>
        </ModalContainer>
      );
    }

    if (isError || !post) {
      return (
        <ModalContainer>
          <ModalContent>
            <p>Post not found or failed to load.</p>
            <CloseButton onClick={handleClose}>×</CloseButton>
          </ModalContent>
        </ModalContainer>
      );
    }
  }

  return (
    <ModalContainer onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={handleClose}>×</CloseButton>
        {mode === "post" && <PostInput isInModal onPostSuccess={handlePostSuccess} />}
        {mode === "reply" && post && (
          <>
            <PostCardCompact post={post} />
            <ReplyInput postId={post.id} isInModal onPostSuccess={handlePostSuccess} />
          </>
        )}
      </ModalContent>
    </ModalContainer>
  );
};

export default PostModal;
