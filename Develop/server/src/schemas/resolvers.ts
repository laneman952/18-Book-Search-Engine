import User, { UserDocument } from '../models/User';
import Book, { BookDocument } from '../models/Book';

import { GraphQLError } from "graphql";

const resolvers = {
  Query: {
    users: async (): Promise<UserDocument[] | null> => {
        try {
    return await User.find({});
    } catch (error) {
      throw new GraphQLError("Failed to fetch users", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }
    },
  },
}
Mutation: {
}
export default resolvers;