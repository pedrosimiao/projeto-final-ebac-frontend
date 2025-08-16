// src/pages/SignUp/index.tsx

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useSignup } from "../../hooks/useAuth";

import AuthLayout from "../../components/AuthLayout";
import { Form, Input, Button } from "../Login/styles";

const signupSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "Username must contain only letters, numbers, or underscores"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpFormInputs = z.infer<typeof signupSchema>;

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormInputs>({
    resolver: zodResolver(signupSchema),
  });

  const navigate = useNavigate();

  const {
    mutate: signupMutate,
    isPending: loading,
    isSuccess,
    isError,
    error: signupError
  } = useSignup();

  useEffect(() => {
    if (isSuccess) {
      alert("Registration successful! You will be redirected to the login page.");
      navigate("/login");
    }
  }, [isSuccess, navigate]);


  const onSubmit = async (data: SignUpFormInputs) => {
    // função de mutação do hook useSignup
    signupMutate({
      username: data.username,
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      confirmPassword: data.confirmPassword,
    });
  };

  return (
    <AuthLayout>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Input type="text" placeholder="First name" {...register("firstName")} />
        {errors.firstName && <p>{errors.firstName.message}</p>}

        <Input type="text" placeholder="Last name" {...register("lastName")} />
        {errors.lastName && <p>{errors.lastName.message}</p>}

        <Input type="text" placeholder="Username" {...register("username")} />
        {errors.username && <p>{errors.username.message}</p>}

        <Input type="email" placeholder="Email" {...register("email")} />
        {errors.email && <p>{errors.email.message}</p>}

        <Input type="password" placeholder="Password" {...register("password")} />
        {errors.password && <p>{errors.password.message}</p>}

        <Input type="password" placeholder="Confirm password" {...register("confirmPassword")} />
        {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}

        {isError && <p style={{ color: "#fff" }}>{signupError || "Ocorreu um erro desconhecido durante o registro."}</p>}

        <Button type="submit" disabled={loading}>{loading ? "Registering..." : "Register"}</Button>
      </Form>
    </AuthLayout>
  );
};

export default SignUp;
