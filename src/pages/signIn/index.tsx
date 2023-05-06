import { useState } from "react";
import { Button, CircularProgress, TextField } from "@mui/material";
import { CoffeeCard } from "@shared/components/Card";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";

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
  passwordConfirmation: string()
    .required("Informação obrigatória")
    .test({
      test: function (value) {
        return value === this.parent.password;
      },
      message: "Senhas deve coincidir",
    }),
});

export default function signIn() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      username: "",
      name: "",

      password: "",
      confirmPassword: "",
    },
    resolver: yupResolver(schema),
  });

  console.log("errors: ", errors);
  const handleSubmitUser = async (data: FormValues) => {};

  return (
    <main className="fixed inset-0 flex">
      <figure style={{ backgroundImage: "url('/login-background.png')" }} className="absolute inset-0 bg-cover" />

      <form
        onSubmit={handleSubmit(handleSubmitUser)}
        className="absolute right-0 top-0 bottom-0 pr-10 flex justify-center items-center"
      >
        <CoffeeCard className="flex flex-col justify-center items-center gap-6 min-w-[20rem] text-black">
          <h1 className="text-3xl text-coffee-light-800 mb-5">Criar usuário</h1>

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

          <Button variant="contained" className="mt-5" type="submit">
            {isLoading ? <CircularProgress size={22} className="text-white" /> : "Cadastrar"}
          </Button>
        </CoffeeCard>
      </form>
    </main>
  );
}
