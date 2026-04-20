import { useCurrentUserContext } from "@/contexts/CurrentUserContext";

export function useCurrentUser() {
  return useCurrentUserContext();
}
