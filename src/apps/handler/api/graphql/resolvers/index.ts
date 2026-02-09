import type { GraphQLContext, Post } from "../types";
import { postsMutation } from "./mutations";
import { postsQuery } from "./queries";
import { UserType } from "./types";

export const resolvers = {
  Query: {
    ...postsQuery,
  },
  Mutation: {
    ...postsMutation,
  },
  Post: {
    author: (parent: Post, _args: unknown, context: GraphQLContext) => {
      return context.userLoader.load(parent.authorId);
    },
  },
  User: UserType,
};
