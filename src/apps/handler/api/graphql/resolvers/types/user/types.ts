import type { User } from "../../../types";

export const UserType = {
  id: (parent: User) => parent.id,
  name: (parent: User) => parent.name,
  email: (parent: User) => parent.email,
};
