import { HttpClient } from "@/models/backend";

export class ClientHttpClient implements HttpClient {
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
    const query = queryParams
      ? "?" + new URLSearchParams(queryParams).toString()
      : "";

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/${url}${query}`,
      {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ✅ browser sends cookies
        body: data ? JSON.stringify(data) : undefined,
      }
    );

    // if (!res.ok) {
    //   const text = await res.text();
    //   throw text ? JSON.parse(text) : { message: "Empty error response" };
    // }
    if (!res.ok) {
      let message = "Request failed";

      try {
        const errorBody = await res.json();
        message = errorBody?.message ?? message;
      } catch {
        message = await res.text();
      }

      throw new Error(message);
    }

    return res.json();
  }
}
