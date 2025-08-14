// src/components/ReplyInput/index.tsx

import { useSelector } from "react-redux";

import { RootState } from "../../store/store";

import PostInput from "../PostInput";

import { IComment } from "../../types";

import { ReplyContainer } from "./styles";

interface ReplyInputProps {
  parentComment?: IComment | null;
  postId: string;
  isInModal?: boolean;
  onPostSuccess?: (id: string, type: 'post' | 'comment') => void;
}

const ReplyInput = ({ parentComment, postId, isInModal, onPostSuccess }: ReplyInputProps) => {
  const selectedParentComment = useSelector(
    (state: RootState) => state.reply.parentComment
  );

  const effectiveParentComment = selectedParentComment || parentComment || null;

  return (
    <ReplyContainer id="reply-input">
      <PostInput
        isComment postId={postId}
        parentComment={effectiveParentComment}
        isInModal={isInModal}
        onPostSuccess={onPostSuccess}
      />
    </ReplyContainer>
  );
};

export default ReplyInput;

