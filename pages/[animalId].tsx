import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { GetServerSidePropsContext } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Animal as AnimalProps } from '../database/animals';
import queryGraphql from '../shared/query-graphql';
import styles from '../styles/Home.module.css';

type Props = {
  animal: AnimalProps;
};

const deleteAnimal = gql`
  mutation DeleteAnimal($id: ID!) {
    deleteAnimal(id: $id) {
      id
    }
  }
`;

export default function Animal(props: Props) {
  const router = useRouter();

  const [deletedAnimal] = useMutation(deleteAnimal);

  async function handleDelete(id: number) {
    const animal = await deletedAnimal({
      variables: {
        id: id,
      },
    });

    if (animal.data) {
      await router.push('/');
    }
  }

  return (
    <>
      <header className={styles.header}>
        <Link href="/">← Back to Animals</Link>
      </header>
      <div className={styles.grid}>
        <div className={styles.gridItem}>
          <Image
            src={`/images/${
              props.animal.id
            }-${props.animal.name.toLowerCase()}.jpeg`}
            alt={props.animal.name}
            width={400}
            height={400}
          />
          <div>
            <h2>{props.animal.name}</h2>
            <p>{props.animal.type}</p>
            <p>{props.animal.accessory}</p>
          </div>

          <div>
            <button>Edit</button>
            <button
              onClick={async () => {
                await handleDelete(props.animal.id);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const animalId = context.params;

  const { animal } = await queryGraphql(
    `
  query($animalId: ID!) {
    animal(id: $animalId) {
      id
      accessory
      name
      type
  }
  }
  `,
    animalId,
  );

  return {
    props: {
      animal,
    },
  };
}
