import { createHandler } from "@/app/api/handler";
import { getExpenses, getTotalIncome } from "@/services/server/home";

const handler = createHandler({
  getService: getTotalIncome,
});

export const GET = handler.GET;
