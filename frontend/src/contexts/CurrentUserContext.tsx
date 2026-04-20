"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { User } from "@/lib/types";
import { mockUsers } from "@/lib/mocks/users";

interface CurrentUserContextValue {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  allUsers: User[];
}

const CurrentUserContext = createContext<CurrentUserContextValue | null>(null);

export function CurrentUserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentUser, setCurrentUserState] = useState<User>(mockUsers[0]);

  const setCurrentUser = useCallback((user: User) => {
    setCurrentUserState(user);
  }, []);

  return (
    <CurrentUserContext.Provider
      value={{ currentUser, setCurrentUser, allUsers: mockUsers }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
}

export function useCurrentUserContext() {
  const ctx = useContext(CurrentUserContext);
  if (!ctx)
    throw new Error(
      "useCurrentUserContext must be used within CurrentUserProvider"
    );
  return ctx;
}
