import { gql, useMutation } from '@apollo/client';
import Head from 'next/head';
import { Fragment, useState } from 'react';
import { Animal } from '../database/animals';
import queryGraphql from '../shared/query-graphql';
import styles from '../styles/Home.module.css';

type Props =
  | {
      errors: { message: string }[];
      animals: undefined;
    }
  | { animals: Animal[] };

// Delete animal by id
const deleteAnimalMutation = gql`
  mutation DeleteAnimal($id: ID!) {
    deleteAnimal(id: $id) {
      id
    }
  }
`;

// Update animal by id
const updateAnimalMutation = gql`
  mutation UpdateAnimal(
    $id: ID!
    $name: String!
    $type: String!
    $accessory: String!
  ) {
    updateAnimal(id: $id, name: $name, type: $type, accessory: $accessory) {
      id
      name
      type
      accessory
    }
  }
`;

export default function AnimalsAdmin(props: Props) {
  const [animals, setAnimals] = useState(props.animals || []);

  const [name, setName] = useState('');
  const [accessory, setAccessory] = useState('');
  const [type, setType] = useState('');
  const [onEditId, setOnEditId] = useState<number | undefined>();
  const [onError, setOnError] = useState('');

  const [animalToDelete] = useMutation(deleteAnimalMutation);
  const [animalToUpdate] = useMutation(updateAnimalMutation);

  if ('errors' in props) {
    return (
      <div>
        {props.errors.map((error) => {
          return <div key={error.message}>{error.message}</div>;
        })}
      </div>
    );
  }

  async function handleAnimalDelete(id: number) {
    try {
      const { data } = await animalToDelete({
        variables: {
          id: id,
        },
      });

      if (data) {
        setAnimals(
          animals.filter((animal) => animal.id !== data.deleteAnimal.id),
        );
      }
    } catch (err) {
      let message;
      if (err instanceof Error) {
        message = err.message;
      } else {
        message = String(err);
      }

      setOnError(message);
    }
  }

  async function handleAnimalUpdate(id: number) {
    try {
      const { data } = await animalToUpdate({
        variables: {
          id: id,
          name: name,
          type: type,
          accessory: accessory,
        },
      });

      if (data) {
        setAnimals(
          animals.map((animal) => {
            if (animal.id === data.updateAnimal.id) {
              return data.updateAnimal;
            } else {
              return animal;
            }
          }),
        );
      }
    } catch (err) {
      let message;
      if (err instanceof Error) {
        message = err.message;
      } else {
        message = String(err);
      }

      setOnError(message);
    }
  }

  return (
    <>
      <Head>
        <title>Apollo server GraphQL lecture</title>
        <meta name="description" content="Protected page" />
      </Head>

      <div className={styles.container}>
        <h1>Animals List</h1>

        {animals.map((animal) => {
          const isEditing = onEditId === animal.id;

          return (
            <Fragment key={animal.id}>
              <input
                value={isEditing ? name : animal.name}
                disabled={!isEditing}
                onChange={(event) => {
                  setName(event.currentTarget.value);
                }}
              />
              <input
                value={isEditing ? type : animal.type}
                disabled={!isEditing}
                onChange={(event) => {
                  setType(event.currentTarget.value);
                }}
              />
              <input
                value={isEditing ? accessory : animal.accessory || ''}
                disabled={!isEditing}
                onChange={(event) => {
                  setAccessory(event.currentTarget.value);
                }}
              />

              <button
                onClick={async () => {
                  await handleAnimalDelete(animal.id);
                }}
              >
                Delete
              </button>
              {!isEditing ? (
                <button
                  onClick={() => {
                    setOnEditId(animal.id);
                    setName(animal.name);
                    setAccessory(animal.accessory);
                    setType(animal.type);
                  }}
                >
                  edit
                </button>
              ) : (
                <button
                  onClick={async () => {
                    setOnEditId(undefined);
                    await handleAnimalUpdate(animal.id);
                  }}
                >
                  save
                </button>
              )}
              <br />
            </Fragment>
          );
        })}
        <p className={styles.error}>{onError}</p>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const { animals } = await queryGraphql(`
query {
    animals {
    id
    name
    type
    accessory
  }
}
`);

  return {
    props: {
      animals,
    },
  };
}
