import { useEffect } from "react";
import { Button, CircularProgress, TextField } from "@mui/material";
import { CoffeeCard } from "@shared/components/Card";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { AppDispatch, RootState } from "@shared/store/store";
import { useDispatch, useSelector } from "react-redux";
import { logIn } from "@shared/store/modules/authSlice";
import { useRouter } from "next/router";

interface FormValues {
  username: string;
  password: string;
}

const schema = object({
  username: string().required("Informação obrigatória"),
  password: string().required("Informação obrigatória"),
});

export default function Login() {
  const dispatch: AppDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const isAuthenticated = useSelector<RootState, boolean>((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) router.push("/coffee");
  }, [isAuthenticated]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: yupResolver(schema),
  });

  const handleSubmitLogin = async (data: FormValues) => {
    setIsLoading(true);
    await dispatch(logIn(data));
    setIsLoading(false);
  };

  const handleGoToSignIn = () => {
    router.push("/signIn");
  };

  return (
    <main className="fixed inset-0 flex">
      <figure style={{ backgroundImage: "url('/login-background.png')" }} className="absolute inset-0 bg-cover" />

      <form
        onSubmit={handleSubmit(handleSubmitLogin)}
        className="absolute left-0 top-0 bottom-0 pl-20 flex justify-center items-center"
      >
        <CoffeeCard className="flex flex-col justify-center items-center gap-6 min-w-[20rem] text-black">
          <h1 className="text-3xl text-coffee-light-800 mb-5">Login</h1>

          <Controller
            control={control}
            name="username"
            render={({ field }) => (
              <TextField
                label="Usuário"
                {...field}
                error={!!errors.username}
                helperText={errors.username?.message ?? ""}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <TextField
                error={!!errors.username}
                helperText={errors.username?.message ?? ""}
                label="Senha"
                type="password"
                {...field}
              />
            )}
          />

          <span className="text-sm">
            Não é um usuário?{" "}
            <strong onClick={handleGoToSignIn} className="text-coffee-light-800 hover:underline cursor-pointer">
              Cadastre-se agora!
            </strong>
          </span>

          <Button variant="contained" className="mt-5" type="submit">
            {isLoading ? <CircularProgress size={22} className="text-white" /> : "Entrar"}
          </Button>
        </CoffeeCard>
      </form>
    </main>
  );
}
