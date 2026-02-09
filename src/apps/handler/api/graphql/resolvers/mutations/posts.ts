import type { Post } from "../../types";

let nextId = 3;

export const postsMutation = {
  createPost: (
    _: unknown,
    { input }: { input: { title: string; content: string; authorId: string } },
  ): Post => {
    const post: Post = {
      id: String(nextId++),
      title: input.title,
      content: input.content,
      authorId: input.authorId,
      createdAt: new Date().toISOString(),
    };
    return post;
  },
  deletePost: (_: unknown, { id }: { id: string }): boolean => {
    // Mock deletion - replace with actual data source logic
    return id !== undefined;
  },
};
