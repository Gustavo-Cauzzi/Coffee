import { RootState } from "@shared/store/store";
import { redirect } from "next/navigation";
import { useRouter } from "next/router";
import { PropsWithChildren, useState } from "react";
import { useSelector } from "react-redux";

const notProtectedRoutes = ["/login", "/signIn"];

export function CoffeeAuthentication() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = useSelector<RootState, boolean>((state) => state.auth.isAuthenticated);

  console.log("isAuthenticated: ", isAuthenticated, notProtectedRoutes.includes(router.pathname), router.pathname);

  if (!notProtectedRoutes.includes(router.pathname) && !isAuthenticated) {
    redirect("/login");
  } else if (notProtectedRoutes.includes(router.pathname) && isAuthenticated) {
    redirect("/");
  } else {
    return <></>;
  }
}
