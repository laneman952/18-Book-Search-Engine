import { User } from "../models/index.js";
import { AuthError, signToken } from "../services/auth.js";

const resolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: any): Promise<any> => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select(
          "-__v -password"
        );
        return userData;
      }
      throw new AuthError("User not authenticated");
    },
  },
  Mutation: {
    login: async (
      _parent: any,
      { email, password }: { email: string; password: string }
    ): Promise<any> => {
      const user = await User.findOne({ email });
      if (!user || !(await user.isCorrectPassword(password))) {
        throw new AuthError("Incorrect credentials");
      }
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    addUser: async (_parent: any, args: any): Promise<any> => {
      const user = await User.create(args);
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    removeBook: async (
      _parent: any,
      { bookId }: { bookId: string },
      context: any
    ): Promise<any> => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthError("User not authenticated");
    },
    saveBook: async (
      _parent: any,
      { bookId }: { bookId: string },
      context: any
    ): Promise<any> => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: { bookId } } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthError("User not authenticated");
    },
  },
};
export default resolvers;
