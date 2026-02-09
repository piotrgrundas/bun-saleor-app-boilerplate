import type { Post } from "../../types";

// Mock data - replace with your actual data source
const POSTS: Post[] = [
  {
    id: "1",
    title: "Hello World",
    content: "This is the first post",
    authorId: "1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Second Post",
    content: "This is the second post",
    authorId: "2",
    createdAt: new Date().toISOString(),
  },
];

export const postsQuery = {
  posts: () => POSTS,
  post: (_: unknown, { id }: { id: string }) => POSTS.find((p) => p.id === id) ?? null,
};
