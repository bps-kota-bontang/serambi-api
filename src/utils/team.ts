import { JWT } from "@/types/jwt";

export const isAdminTeam = (claims: JWT, team: any): boolean => {
  if (claims.isSuper) return true;
  return team?.users.find((user: any) => user.id === claims.sub)?.isAdmin;
};
