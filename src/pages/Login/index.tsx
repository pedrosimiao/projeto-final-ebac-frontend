// src/pages/Login/index.tsx

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useLocation, useNavigate } from "react-router-dom";

import { useLogin } from "../../hooks/useAuth";

import AuthLayout from "../../components/AuthLayout";
import { Form, Input, Button } from "./styles";

const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Username or email is required")
    .refine(value => {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      const isUsername = /^[a-zA-Z0-9_]{3,}$/.test(value);
      return isEmail || isUsername;
    }, {
      message: "Enter username or email",
    }),
  password: z.string().min(1, "Password is required"),
});


type LoginFormInputs = z.infer<typeof loginSchema>;


const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const navigate = useNavigate();
  const location = useLocation();

  const {
    mutate: loginMutate,
    isPending: loading,
    isSuccess,
    isError,
    error: loginError
  } = useLogin();

  useEffect(() => {
    // navegação depende do isSuccess
    if (isSuccess) {
      // const from = location.state?.from?.pathname || '/home';
      navigate('/home', { replace: true });
    }
  }, [isSuccess, navigate, location]);

  const onSubmit = async (data: LoginFormInputs) => {
    loginMutate({ // função de mutação
      identifier: data.identifier,
      password: data.password,
    });
  };


  return (
    <AuthLayout>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="text"
          placeholder="Username or email"
          {...register("identifier")}
        />
        {errors.identifier && <p>{errors.identifier.message}</p>}

        <Input
          type="password"
          placeholder="Password"
          {...register("password")}
        />
        {errors.password && <p>{errors.password.message}</p>}

        {isError && <p style={{ color: "red" }}>{loginError || "Ocorreu um erro desconhecido."}</p>}

        <Button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</Button>
      </Form>
    </AuthLayout>
  );
};

export default Login;


/*

###REGEX###

Email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/

^ e $: âncoras para início e fim da string(garante que tudo seja validado).

[^\s @]+: pelo menos um caractere que não seja espaço(\s) nem arroba(@) → parte antes do @.

@: símbolo obrigatório do email.

[^\s @]+: domínio(ex: gmail)

\.: ponto literal antes da extensão.

[^\s @]+: extensão do domínio(ex: com, org)


Username: /^[a-zA-Z0-9_]{3,}$/

^ e $: início e fim da string.

[a - zA - Z0 -9_]: aceita letras maiúsculas e minúsculas, números e underscore _.

{ 3,}: exige mínimo de 3 caracteres(sem limite máximo).

*/
