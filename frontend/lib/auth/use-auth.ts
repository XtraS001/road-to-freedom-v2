import useSWR from "swr";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import httpClient, { restClient } from "../httpClient";
import { HttpErrorResponse } from "@/models/http/HttpErrorResponse";
import { UserResponse } from "@/models/user/UserResponse";
import { LoginRequest } from "@/models/backend";

interface AuthProps {
  middleware?: "auth" | "guest";
  redirectIfAuthenticated?: string; // This means the /url route if authenticated. Exp: /dashboard
}

export const useAuthGuard = ({
  middleware,
  redirectIfAuthenticated,
}: AuthProps) => {
  const router = useRouter();

  const {
    data: user,
    error,
    mutate,
  } = useSWR("/api/auth/me", () =>
    httpClient.get<UserResponse>("/api/auth/me").then((res) => res.data)
  );

  const login = async ({
    onError,
    props,
  }: {
    onError: (errors: HttpErrorResponse | undefined) => void;
    props: LoginRequest;
  }) => {
    onError(undefined);
    // await csrf();
    restClient
      .login(props)
      .then(() => mutate())
      .catch((err) => {
        const errors = err.response.data as HttpErrorResponse;
        onError(errors);
      });
  };

  // const csrf = async () => {
  //   await restClient.csrf();
  // };

  const logout = async () => {
    if (!error) {
      await restClient.logout().then(() => mutate());
    }

    window.location.pathname = "/auth/login";
  };

  useEffect(() => {
    // If middleware is 'guest' and we have a user, redirect
    if (middleware === "guest" && redirectIfAuthenticated && user) {
      router.push(redirectIfAuthenticated);
    }

    // If middleware is 'auth' and we have an error, logout
    if (middleware === "auth" && error) {
      logout();
    }
  }, [user, error]);

  return {
    user,
    login,
    logout,
    mutate,
  };
};

// "use client";

// import useSWR from "swr";
// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import httpClient, { restClient } from "../httpClient";
// import { HttpErrorResponse } from "@/models/http/HttpErrorResponse";
// import { UserResponse } from "@/models/user/UserResponse";
// import { LoginRequest } from "@/models/backend";

// interface AuthProps {
//   middleware?: "auth" | "guest";
//   redirectIfAuthenticated?: string;
// }

// export const useAuthGuard = ({
//   middleware,
//   redirectIfAuthenticated,
// }: AuthProps) => {
//   const router = useRouter();

//   // Client-only fetch
//   const {
//     data: user,
//     error,
//     mutate,
//   } = useSWR<UserResponse>("/api/auth/me", () =>
//     httpClient.get<UserResponse>("/api/auth/me").then((res) => res.data)
//   );

//   const login = async ({
//     onError,
//     props,
//   }: {
//     onError: (errors: HttpErrorResponse | undefined) => void;
//     props: LoginRequest;
//   }) => {
//     onError(undefined);
//     try {
//       await restClient.login(props);
//       mutate();
//     } catch (err: any) {
//       onError(err.response?.data as HttpErrorResponse);
//     }
//   };

//   const logout = async () => {
//     if (!error) {
//       await restClient.logout();
//       mutate();
//     }
//     // Client-only redirect
//     if (typeof window !== "undefined") {
//       window.location.pathname = "/auth/login";
//     }
//   };

//   useEffect(() => {
//     if (middleware === "guest" && redirectIfAuthenticated && user) {
//       router.push(redirectIfAuthenticated);
//     }

//     if (middleware === "auth" && error) {
//       logout();
//     }
//   }, [user, error]);

//   return { user, login, logout, mutate };
// };
