import DataLoader from "dataloader";

import type { User } from "../../../types";

// Mock user data - replace with your actual data source
const USERS: User[] = [
  { id: "1", name: "Alice", email: "alice@example.com" },
  { id: "2", name: "Bob", email: "bob@example.com" },
];

export function createUserLoader(): DataLoader<string, User | null> {
  return new DataLoader(async (ids) => {
    return ids.map((id) => USERS.find((u) => u.id === id) ?? null);
  });
}
