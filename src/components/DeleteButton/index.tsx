// DeleteButton/index.tsx

import { useLocation, useNavigate } from "react-router-dom";

import { useCurrentUserProfile } from "../../hooks/useUsers";

import { FiTrash2 } from "react-icons/fi";

import { IconWrapper } from "./styles";

type DeleteButtonProps = {
  authorId: string;
  id: string;
  isComment?: boolean;
};

const DeleteButton = ({ authorId, id, isComment }: DeleteButtonProps) => {
  const { data: currentUser, isLoading: isCurrentUserLoading } = useCurrentUserProfile();

  const location = useLocation();
  const navigate = useNavigate();

  if (isCurrentUserLoading) return null;

  if (!currentUser || currentUser.id !== authorId) return null;

  return (
    <IconWrapper
      onClick={() =>
        navigate(`/delete/${isComment ? "comment" : "post"}/${id}`, {
          state: { background: location },
        })
      }
    >
      <FiTrash2 size={18} />
    </IconWrapper>
  );
};

export default DeleteButton;
