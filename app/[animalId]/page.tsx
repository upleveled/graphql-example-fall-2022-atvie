import Image from 'next/image';
import Link from 'next/link';
import { Animal } from '../../database/animals';
import queryGraphql from '../../shared/query-graphql';
import styles from '../../styles/Home.module.css';

type Props = {
  params: string;
};

export default async function AnimalPage(props: Props) {
  const animalId = props.params;

  const { animal } = (await queryGraphql(
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
  )) as { animal: Animal };

  return (
    <>
      <header className={styles.header}>
        <Link href="/">← Back to Animals</Link>
      </header>
      <h1 className={styles.title}>{animal.name}</h1>
      <div className={styles.grid}>
        <div className={styles.gridItem}>
          <Image
            src={`/images/${animal.id}-${animal.name.toLowerCase()}.jpeg`}
            alt={animal.name}
            width={400}
            height={400}
          />
          <div>
            <h2>{animal.name}</h2>
            <p>{animal.type}</p>
            <p>{animal.accessory}</p>
          </div>
        </div>
      </div>
    </>
  );
}
