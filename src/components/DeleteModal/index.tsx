// src/components/DeleteModal/index.tsx

import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import { useDeletePost } from "../../hooks/usePosts";
import { useDeleteComment } from "../../hooks/useComments";
import { useDeleteAccount } from "../../hooks/useUsers";
import { logout } from "../../store/slices/authSlice";

import {
  ModalOverlay,
  ModalContent,
  ModalTitle,
  ModalActions,
  ConfirmDelete,
  CancelButton,
} from "./styles";

import { Input } from "../../pages/Feed/EditProfilePage/styles";

type DeleteModalProps = {
  type: "post" | "comment" | "account";
};

const DeleteModal = ({ type }: DeleteModalProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { postId, commentId } = useParams();

  const { deletePost, isLoading: isDeletingPost } = useDeletePost();
  const { deleteComment, isLoading: isDeletingComment } = useDeleteComment();

  const {
    mutate: deleteAccount,
    isPending: isDeletingAccount,
    isSuccess: isDeleteAccountSuccess,
    isError: isDeleteAccountError,
    error: deleteAccountError,
  } = useDeleteAccount();

  const [passwordForAccountDeletion, setPasswordForAccountDeletion] = React.useState('');
  const [accountDeletionError, setAccountDeletionError] = React.useState<string | null>(null);

  useEffect(() => {
    if (isDeleteAccountSuccess) {
      dispatch(logout());
      navigate("/", { replace: true });
    }
  }, [isDeleteAccountSuccess, dispatch, navigate]);

  useEffect(() => {
    if (isDeleteAccountError) {
      setAccountDeletionError(deleteAccountError || "Failed to delete account.");
    }
  }, [isDeleteAccountError, deleteAccountError]);

  const handleDelete = () => {
    if (type === "post" && postId) {
      deletePost(postId, {
        onSuccess: () => {
          navigate(-1);
        },
        onError: (error) => {
          console.error("Error deleting post:", error.message);
          alert(`Error deleting post: ${error.message}`);
        },
      });
    } else if (type === "comment" && commentId) {
      deleteComment(commentId, {
        onSuccess: () => {
          navigate(-1);
        },
        onError: (error) => {
          console.error("Error deleting comment:", error.message);
          alert(`Error deleting comment: ${error.message}`);
        },
      });
    } else if (type === "account") {
      if (!passwordForAccountDeletion) {
        setAccountDeletionError("Please enter your password to confirm account deletion.");
        return;
      }
      deleteAccount({ password: passwordForAccountDeletion });
    }
  };

  const isLoading = isDeletingPost || isDeletingComment || isDeletingAccount;

  const renderPasswordField = type === "account";

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalTitle>
          {type === "comment"
            ? "Are you sure you want to delete this comment?"
            : type === "post"
              ? "Are you sure you want to delete this post?"
              : "Are you sure you want to delete your account?"}
        </ModalTitle>

        {renderPasswordField && (
          <>
            <h4>This action is irreversible. To confirm, please enter your password:</h4>
            <Input
              type="password"
              placeholder="Your password"
              value={passwordForAccountDeletion}
              onChange={(e) => setPasswordForAccountDeletion(e.target.value)}
              disabled={isLoading}
              style={{ marginBottom: '10px' }}
            />
            {accountDeletionError && <p style={{ color: 'red', fontSize: '0.8em' }}>{accountDeletionError}</p>}
          </>
        )}

        <ModalActions>
          <CancelButton onClick={() => navigate(-1)} disabled={isLoading}>
            Cancel
          </CancelButton>
          <ConfirmDelete onClick={handleDelete} disabled={isLoading}>
            {isLoading ? "Deleting..." : type === "account" ? "Delete My Account" : "Delete"}
          </ConfirmDelete>
        </ModalActions>
      </ModalContent>
    </ModalOverlay>
  );
};

export default DeleteModal;
