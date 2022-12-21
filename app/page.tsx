import Image from 'next/image';
import Link from 'next/link';
import { Animal } from '../database/animals';
import queryGraphql from '../shared/query-graphql';
import styles from '../styles/Home.module.css';

export default async function Home() {
  const { animals } = (await queryGraphql(`
query {
    animals {
    id
    name
  }
}
`)) as { animals: Animal[] };

  return (
    <>
      <h1 className={styles.title}>Home</h1>
      <div className={styles.grid}>
        {animals.map((animal: Animal) => {
          return (
            <Link
              key={animal.id}
              className={styles.card}
              href={`/${animal.id}`}
            >
              <Image
                src={`/images/${animal.id}-${animal.name.toLowerCase()}.jpeg`}
                alt={animal.name}
                width={200}
                height={200}
              />
              <div>
                <h2>{animal.name}</h2>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
