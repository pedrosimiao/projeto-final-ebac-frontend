// src/pages/Feed/DeleteProfilePage/index.tsx

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { useDispatch } from "react-redux";

import { AppDispatch } from "../../../store/store";

import { logout } from "../../../store/slices/authSlice";

import { useDeleteAccount } from "../../../hooks/useUsers";

import FeedHeader from "../../../components/FeedHeader";
import { BackLink, FeedHeaderTextContent } from "../../../components/FeedHeader/styles";

import {
  SettingsPageContainer,
  FormContainer,
  Input,
  Label,
  ButtonGroup,
  SaveButton,
  CancelButton,
} from "../EditProfilePage/styles";

import { FaArrowLeft, FaExclamationTriangle } from "react-icons/fa";

const deleteAccountSchema = z.object({
  password: z.string().min(1, "Password is required for account deletion"),
});

type DeleteAccountInputs = z.infer<typeof deleteAccountSchema>;

const DeleteProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>(); // Inicializa o dispatch do Redux


  const { mutate: deleteAccount, isPending: isLoading, isError } = useDeleteAccount();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeleteAccountInputs>({
    resolver: zodResolver(deleteAccountSchema),
  });

  // Estado para exibir mensagens de erro da API
  const [apiError, setApiError] = useState<string | null>(null);


  const onSubmit = (data: DeleteAccountInputs) => {
    setApiError(null); // Limpa qualquer erro anterior
    deleteAccount(
      { password: data.password },
      {
        onSuccess: (message) => {
          console.log("Conta deletada com sucesso:", message);
          dispatch(logout()); // ação de logout do Redux
          navigate("/login");
        },
        onError: (err) => {
          console.error("Erro ao deletar conta no componente:", err);
          setApiError("Failed to delete account. Please check your password and try again.");
        },
      }
    );
  };

  return (
    <SettingsPageContainer>
      <FeedHeader>
        <BackLink to="/settings">
          <FaArrowLeft />
        </BackLink>
        <FeedHeaderTextContent>
          <h1>Delete account</h1>
        </FeedHeaderTextContent>
        <FaExclamationTriangle style={{ marginLeft: "16px", fontSize: "30px", color: "#ffff22" }} />
      </FeedHeader>

      <FormContainer onSubmit={handleSubmit(onSubmit)}>
        <h4>Please confirm your password to proceed.</h4>

        <Label>Password</Label>
        <Input type="password" {...register("password")} />

        {errors.password && <p style={{ color: "red", fontSize: "0.8em" }}>{errors.password.message}</p>}
        {isError && apiError && (
          <p style={{ color: "red", fontSize: "0.8em", marginTop: "10px" }}>
            {apiError}
          </p>
        )}

        <ButtonGroup>
          <CancelButton type="button" onClick={() => navigate("/settings")}>
            Cancel
          </CancelButton>
          <SaveButton type="submit" disabled={isLoading}>
            {isLoading ? "Deleting..." : "Delete"}
          </SaveButton>
        </ButtonGroup>
      </FormContainer>
    </SettingsPageContainer>
  );
};

export default DeleteProfilePage;
