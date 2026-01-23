import { HttpClient } from "@/models/backend";
import { cookies } from "next/headers";

export class ServerHttpClient implements HttpClient {
  async request<R>({
    method,
    url,
    queryParams,
    data,
  }: {
    method: string;
    url: string;
    queryParams?: any;
    data?: any;
  }): Promise<R> {
    console.log("ServerHttpClient here");

    // Newly added code to forward cookies
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    const query = queryParams
      ? "?" + new URLSearchParams(queryParams).toString()
      : "";
    // console.log(
    //   "Url " +
    //     `${process.env.NEXT_PUBLIC_BASE_URL}/${url}${query}` +
    //     "method: " +
    //     method +
    //     " data: " +
    //     JSON.stringify(data)
    // );
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/${url}${query}`,
      {
        method,
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieHeader, // 🔴 THIS IS THE FIX // Newly added code to forward cookies
        },
        credentials: "include",
        body: data ? JSON.stringify(data) : undefined,
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw text ? JSON.parse(text) : { message: "Empty error response" };
    }

    return res.json();
  }
}
