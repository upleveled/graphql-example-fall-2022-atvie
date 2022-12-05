import { sql } from './connect';

export type Animal = {
  id: number;
  name: string;
  type: string;
  accessory: string;
};

export type AnimalInput = Omit<Animal, 'id'>;

// Get all animals
export async function getAnimals() {
  return await sql<Animal[]>`
    SELECT * FROM animals
  `;
}

// Get a single animal
export async function getAnimalById(id: number) {
  return (
    await sql<Animal[]>`
      SELECT
        *
      FROM
        animals
      WHERE
        id = ${id}
  `
  )[0];
}

// Create a new animal
export async function createAnimal(
  name: string,
  type: string,
  accessory: string,
) {
  return (
    await sql<Animal[]>`
      INSERT INTO animals
        (name, type, accessory)
      VALUES
        (${name}, ${type}, ${accessory})
      RETURNING *
  `
  )[0];
}

// Update an animal
export async function updateAnimalById(
  id: number,
  name: string,
  type: string,
  accessory: string,
) {
  return (
    await sql<Animal[]>`
      UPDATE
        animals
      SET
        name = ${name},
        type = ${type},
        accessory = ${accessory}
      WHERE
        id = ${id}
      RETURNING *
  `
  )[0];
}

// Delete an animal
export async function deleteAnimalById(id: number) {
  return (
    await sql<Animal[]>`
      DELETE FROM
        animals
      WHERE
        id = ${id}
      RETURNING *
  `
  )[0];
}
