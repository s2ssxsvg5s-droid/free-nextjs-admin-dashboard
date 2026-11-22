import { getRequestConfig } from "next-intl/server";
import messages from "@/messages/zh-TW.json";

// The published MVP is Traditional Chinese and needs no request-time locale routing.
export default getRequestConfig(async () => ({ locale: "zh-TW", messages }));
