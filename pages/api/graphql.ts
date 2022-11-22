import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { gql } from 'graphql-tag';

const typeDefs = gql`
  type Query {
    # Query for animals
    animals: [Animal]
    animal(id: ID!): Animal
  }

  # Animal type definition
  type Animal {
    id: ID!
    name: String
    type: String
    accessory: String
  }
`;

// TypeScript type definition
export type Animal = {
  id: number;
  name: string;
  type: string;
  accessory: string;
};

// Fake data
const animals = [
  {
    id: 1,
    name: 'Ralph',
    type: 'Tiger',
    accessory: 'Gold chain',
  },
  {
    id: 2,
    name: 'Evelina',
    type: 'Hedgehog',
    accessory: 'Comb',
  },
  {
    id: 3,
    name: 'Otto',
    type: 'Otter',
    accessory: 'Stone',
  },
  {
    id: 4,
    name: 'Mayo',
    type: 'Dog',
    accessory: 'Sweater',
  },
  {
    id: 5,
    name: 'Kaaaarl',
    type: 'Llama',
    accessory: 'Toque',
  },
  {
    id: 6,
    name: 'Lulu',
    type: 'Dog',
    accessory: 'Toque',
  },
];

// Create Resolvers
const resolvers = {
  Query: {
    //  Query for animals
    animals() {
      return animals;
    },

    // Query for a single animal
    animal(parent: any, { id }: any) {
      return animals.find((animal) => animal.id === parseInt(id));
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
export default startServerAndCreateNextHandler(server);
