import { GetServerSidePropsContext } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Animal as AnimalProps } from '../database/animals';
import queryGraphql from '../shared/query-graphql';
import styles from '../styles/Home.module.css';

type Props = {
  animal: AnimalProps;
};

export default function Animal(props: Props) {
  return (
    <>
      <header className={styles.header}>
        <Link href="/">← Back to Animals</Link>
      </header>
      <h1 className={styles.title}>{props.animal.name}</h1>
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
