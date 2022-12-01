import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { gql } from 'graphql-tag';
import {
  AnimalInput,
  createAnimal,
  deleteAnimal,
  getAnimal,
  getAnimals,
  updateAnimal,
} from '../../database/animals';

// TypeScript type for the context Objects
type DeleteAnimalContext = {
  req: {
    cookies: {
      sessionToken: string;
    };
  };
};

type CreateAnimalContext = {
  res: {
    setHeader: (name: string, value: string) => void;
  };
};

const typeDefs = gql`
  type Query {
    # Query for animals
    animals: [Animal]
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
function createSerializedCookie(name: string) {
  return `sessionToken=${name}; HttpOnly; SameSite=lax; Path=/; Max-Age=3600`;
}

// Create Resolvers
const resolvers = {
  Query: {
    //  Query for animals
    animals() {
      // return animals;
      return getAnimals();
    },

    // Query for a single animal
    animal(parent: string, { id }: { id: string }) {
      // return animals.find((animal) => animal.id === parseInt(id));
      return getAnimal(parseInt(id));
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

      // Call the serialized cookie function
      const serializedCookie = createSerializedCookie(name);

      context.res.setHeader('Set-Cookie', serializedCookie);

      return createAnimal(name, type, accessory);
    },

    // Update an existing animal
    updateAnimal(
      parent: string,
      { id, name, type, accessory }: AnimalInput & { id: string },
    ) {
      return updateAnimal(parseInt(id), name, type, accessory);
    },

    // Delete an existing animal
    deleteAnimal(
      parent: string,
      { id }: { id: string },
      context: DeleteAnimalContext,
    ) {
      if (context.req.cookies.sessionToken !== 'Admin') {
        throw new Error('You are not authorized to delete this animal');
      }
      return deleteAnimal(parseInt(id));
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
    return await { req, res };
  },
});
