import { gql } from '@apollo/client';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { makeExecutableSchema } from '@graphql-tools/schema';
import {
  AnimalInput,
  createAnimal,
  deleteAnimalById,
  getAnimalById,
  getAnimals,
  updateAnimalById,
} from '../../database/animals';

// TypeScript types

type DeleteAnimalContext = {
  adminAnimal: {
    name: string;
  };
  req: {
    cookies: {
      fakeSessionToken: string;
    };
  };
};

type CreateAnimalContext = {
  res: {
    setHeader: (name: string, value: string) => void;
  };
};

type Argument = {
  id: string;
};

type UpdateAnimalInput = AnimalInput & Argument;

// GraphQL schema
const typeDefs = gql`
  type Query {
    # Query all animals
    animals: [Animal]

    # Query a single animal by ID
    animal(id: ID!): Animal
  }

  # Mutation type definition
  type Mutation {
    # Create a new animal
    createAnimal(name: String!, type: String!, accessory: String): Animal

    # Update an existing animal
    updateAnimal(id: ID!, name: String, type: String, accessory: String): Animal

    # Delete an existing animal
    deleteAnimal(id: ID!): Animal
  }

  # Animal type definition
  type Animal {
    id: ID!
    name: String
    type: String
    accessory: String
  }
`;

// Now we are getting this data from the database
// const animals = [
//   {
//     id: 1,
//     name: 'Ralph',
//     type: 'Tiger',
//     accessory: 'Gold chain',
//   },
//   {
//     id: 2,
//     name: 'Evelina',
//     type: 'Hedgehog',
//     accessory: 'Comb',
//   },
//   {
//     id: 3,
//     name: 'Otto',
//     type: 'Otter',
//     accessory: 'Stone',
//   },
//   {
//     id: 4,
//     name: 'Mayo',
//     type: 'Dog',
//     accessory: 'Sweater',
//   },
//   {
//     id: 5,
//     name: 'Kaaaarl',
//     type: 'Llama',
//     accessory: 'Toque',
//   },
//   {
//     id: 6,
//     name: 'Lulu',
//     type: 'Dog',
//     accessory: 'Toque',
//   },
// ];

// Create fake serializedCookie for authentication
function createMockSerializedCookie(name: string) {
  return `fakeSessionToken=${name}; HttpOnly; SameSite=lax; Path=/; Max-Age=3600`;
}

// Create Resolvers
const resolvers = {
  Query: {
    //  resolver for the animals query
    animals() {
      return getAnimals();
    },

    // resolver for the animal query
    animal(parent: string, args: Argument) {
      return getAnimalById(parseInt(args.id));
    },
  },

  // Mutation resolvers
  Mutation: {
    // Create a new animal
    createAnimal(
      parent: string,
      { name, type, accessory }: AnimalInput,
      context: CreateAnimalContext,
    ) {
      if (
        typeof name !== 'string' ||
        typeof type !== 'string' ||
        typeof accessory !== 'string' ||
        !name ||
        !type ||
        !accessory
      ) {
        throw new Error('All fields are required');
      }

      // Create cookies each time a new animal is created
      const fakeSerializedCookie = createMockSerializedCookie(name);
      context.res.setHeader('Set-Cookie', fakeSerializedCookie);

      return createAnimal(name, type, accessory);
    },

    // Update an existing animal
    updateAnimal(
      parent: string,
      { id, name, type, accessory }: UpdateAnimalInput,
    ) {
      return updateAnimalById(parseInt(id), name, type, accessory);
    },

    // Delete an existing animal
    deleteAnimal(parent: string, args: Argument, context: DeleteAnimalContext) {
      if (context.adminAnimal.name !== context.req.cookies.fakeSessionToken) {
        throw new Error('You are not authorized to delete this animal');
      }
      return deleteAnimalById(parseInt(args.id));
    },
  },
};

// Create the schema
export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Create the Apollo server
const server = new ApolloServer({
  schema,
});

// Start the server and create a Next.js handler
export default startServerAndCreateNextHandler(server, {
  context: async (req, res) => {
    const adminAnimal = await getAnimalById(1);

    return { req, res, adminAnimal };
  },
});
