"use client";

import ErrorFeedback from "@/components/error-feedback";
import { useAuthGuard } from "@/lib/auth/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { toast } from "sonner";
import { z } from "zod";
import { updatePasswordAction } from "../actions/updatePasswordAction";

const schema = z
  .object({
    oldPassword: z.string().optional(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    passwordResetToken: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type Schema = z.infer<typeof schema>;

export default function UpdatePasswordForm() {
  const { mutate } = useAuthGuard({ middleware: "auth" });
  const [errors, setErrors] = React.useState<any>(undefined);

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      oldPassword: "",
      password: "",
      confirmPassword: "",
      passwordResetToken: "emptyString",
    },
  });

  const onSubmit = async (data: Schema) => {
    setErrors(undefined);
    try {
      await updatePasswordAction(data);
      toast.success("Password updated successfully");
      mutate(); // refresh user
    } catch (e) {
      setErrors(e);
    }
  };

  return (
    <div className="max-w-(--breakpoint-sm)">
      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit)} 
          className="flex flex-col gap-y-2"
        >
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Old password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Update password</Button>
        </form>
      </Form>

      <ErrorFeedback data={errors} className="mt-2" />
    </div>
  );
}
