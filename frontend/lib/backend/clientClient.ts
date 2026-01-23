import { RestApplicationClient } from "@/models/backend";
import { ClientHttpClient } from "./clientHttpClient";

export const clientRestClient = new RestApplicationClient(  // For client components
  new ClientHttpClient()
);
