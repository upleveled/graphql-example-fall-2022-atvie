import { sql } from './connect';

export type Animal = {
  id: number;
  name: string;
  type: string;
  accessory: string;
};

// Get all animals
export async function getAnimals() {
  return await sql<Animal[]>`
    SELECT * FROM animals
  `;
}

// Get a single animal
export async function getAnimal(id: number) {
  return (
    await sql<Animal[]>`
      SELECT
        *
      FROM
        animals
      WHERE id = ${id}
  `
  )[0];
}
