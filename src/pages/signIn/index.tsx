import { useState } from "react";
import { Button, CircularProgress, TextField } from "@mui/material";
import { CoffeeCard } from "@shared/components/Card";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";
import { getApi } from "@shared/services/api";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import styles from "../../shared/styles/signIn.module.scss";

interface FormValues {
  username: string;
  name: string;

  password: string;
  confirmPassword: string;
}

const schema = object().shape({
  username: string().required("Informação obrigatória").max(20),
  name: string().required("Informação obrigatória").max(60),
  password: string().required("Informação obrigatória").max(200).min(4, "Senha deve ter pelo menos 4 caracteres"),
  confirmPassword: string()
    .required("Informação obrigatória")
    .test({
      test: function (value) {
        return value === this.parent.password;
      },
      message: "Senhas deve coincidir",
    }),
});

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      username: "",
      name: "",

      password: "",
      confirmPassword: "",
    },
    resolver: yupResolver(schema),
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const handleSubmitUser = async ({ confirmPassword, ...data }: FormValues) => {
    setIsLoading(true);
    type Response = { message?: string };
    const response = await getApi().post<Response>("/users", data);

    if (response.status === 270) {
      toast.error(response.data.message ?? "");
      return;
    } else {
      toast.success("Usuário criado");
      router.push("/login");
    }

    setIsLoading(false);
  };

  const passwordMismatch = password && confirmPassword && password !== confirmPassword;

  return (
    <main className="fixed inset-0 flex">
      <figure className={styles["rotated-background"]} />

      <form
        onSubmit={handleSubmit(handleSubmitUser)}
        className="absolute right-0 top-0 bottom-0 pr-10 flex justify-center items-center"
      >
        <CoffeeCard className="flex flex-col justify-center items-center gap-6 min-w-[20rem] text-black">
          <h1 className="text-3xl text-coffee-light-800 mb-5">Criar usuário</h1>

          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <TextField label="Nome" {...field} error={!!errors.name} helperText={errors.name?.message ?? ""} />
            )}
          />
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

          {/* <hr className="my-2 max-w-[250px] bg-gray-400 w-full h-[2px]" /> */}

          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <TextField
                error={!!errors.password}
                helperText={errors.password?.message ?? ""}
                label="Senha"
                type="password"
                {...field}
              />
            )}
          />
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <TextField
                label="Confirmar a senha"
                type="password"
                {...field}
                error={!!errors.confirmPassword || !!passwordMismatch}
                helperText={errors.confirmPassword?.message ?? ((passwordMismatch && "Senhas não coincidem") || "")}
              />
            )}
          />

          <Button variant="contained" className="mt-5" type="submit">
            {isLoading ? <CircularProgress size={22} className="text-white" /> : "Cadastrar"}
          </Button>
        </CoffeeCard>
      </form>
    </main>
  );
}
