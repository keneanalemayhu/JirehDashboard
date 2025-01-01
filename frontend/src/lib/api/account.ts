// lib/api/account.ts
import { api } from "./api";
import { AccountData, AccountUpdateData } from "@/types/dashboard/business/account";

export async function fetchAccountData(): Promise<AccountData> {
  try {
    const response = await api.get("/api/auth/account/");
    return response.data;
  } catch (error) {
    console.error("[accountApi.fetch] Error:", error);
    throw error;
  }
}

export async function updateAccountData(data: AccountUpdateData) {
  try {
    const response = await api.put("/api/auth/account/", data);
    return response.data;
  } catch (error) {
    console.error("[accountApi.update] Error:", error);
    throw error;
  }
}