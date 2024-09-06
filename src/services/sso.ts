import { UserSso } from "@/types/userSso";

export const getUserInfo = async (token: string) => {
  const response = await fetch(
    "https://sso.bps.go.id/auth/realms/pegawai-bps/protocol/openid-connect/userinfo",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch user info");
  }

  return result as UserSso;
};
