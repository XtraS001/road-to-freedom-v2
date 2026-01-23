"use client";

import { Suspense } from "react";
import { ResetPasswordForm } from "./components/ResetPasswordForm";

export function ResetPasswordClient() {
  return (
    <Suspense fallback={<div />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
