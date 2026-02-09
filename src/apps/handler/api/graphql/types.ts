import type DataLoader from "dataloader";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
}

export interface GraphQLContext {
  userLoader: DataLoader<string, User | null>;
}
