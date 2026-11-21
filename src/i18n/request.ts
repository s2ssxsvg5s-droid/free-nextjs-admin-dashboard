import { getRequestConfig } from "next-intl/server";
import messages from "@/messages/en.json";

// The published MVP is English-only and needs no request-time locale routing.
export default getRequestConfig(async () => ({ locale: "en", messages }));
