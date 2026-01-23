"use client";

import Container from "@/components/container";
import { restClient } from "@/lib/httpClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import useSWR from "swr";

export default function page() {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      message: "",
      title: "",
      url: "",
    },
  });

  const onSubmit = (data: any) => {
    restClient
      .pushNotificationNotify(data)
      .then(() => {
        toast.success("Notification sent successfully");
        reset();
      })
      .catch(() => {
        toast.error("Failed to send notification");
      });
  };

  const { data: notificationDeliveryData } = useSWR("/api/notifications/delivery", () => restClient.getNotificationDeliveryStats())
  const { data: subscribersData } = useSWR("/api/notifications/stats/subscriptions", () => restClient.getNotificationSubscriptionStats())

  return (
    <Container size="xl">
      <h1 className="text-3xl font-bold tracking-tight mb-4">Notifications</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-md">
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Notification title"
            {...register("title")}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="message">Message</Label>
          <Input
            id="message"
            placeholder="Notification message"
            {...register("message")}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="url">URL</Label>
          <Input
            id="url"
            placeholder="Notification url"
            {...register("url")}
          />
        </div>

        <Button type="submit" className="mt-2">
          Send notification
        </Button>
      </form>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Notifications sent</h2>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={notificationDeliveryData?.data || []}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sent" stroke="#4f46e5" strokeWidth={2} />
              <Line type="monotone" dataKey="delivered" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Subscriptions</h2>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={subscribersData?.data || []}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="subscribers" stroke="#4f46e5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Container>
  );
}
