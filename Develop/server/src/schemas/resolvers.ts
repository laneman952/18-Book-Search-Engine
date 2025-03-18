import { User } from '../models/index.js';
import { AuthError, signToken } from '../services/auth.js';


import { GraphQLError } from "graphql";

const resolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: any): Promise<any> => {
        if (context.user) {
            const userData = await User.findOne({ _id: context.user._id })
                .select('-__v -password')
            return userData;
        }
        throw new AuthError('User not authenticated');
        }
      }
    }
Mutation: {

}
export default resolvers;