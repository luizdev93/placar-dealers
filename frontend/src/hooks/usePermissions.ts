import { useMemo } from "react";
import { User } from "@/lib/types";
import { getPermissions, Permissions } from "@/lib/permissions";

export function usePermissions(user: User): Permissions {
  return useMemo(() => getPermissions(user), [user]);
}
