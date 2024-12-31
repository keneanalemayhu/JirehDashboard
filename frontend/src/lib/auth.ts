import { cookies } from "next/headers";

export const getToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token");
};

export const removeToken = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
};
