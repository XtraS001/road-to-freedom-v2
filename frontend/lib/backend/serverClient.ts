import { RestApplicationClient } from "@/models/backend";
import { ServerHttpClient } from "./serverHttpClient";

export const serverRestClient = new RestApplicationClient(  // For server components
  new ServerHttpClient()
);
