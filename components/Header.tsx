import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

const fakeLoggedInAnimal = gql`
  query FakeLoggedInAnimal($name: String!) {
    fakeLoggedInAnimal(name: $name) {
      accessory
      name
      type
    }
  }
`;

export default function Header() {
  const { data } = useQuery(fakeLoggedInAnimal, {
    variables: {
      name: '',
    },
  });

  return (
    <header>
      <nav className={styles.header}>
        <div>
          <Link href="/">Home</Link>
          <Link href="/create-animal">Create Animal</Link>
          <Link href="/admin-animal">Admin Animal</Link>
        </div>
        <div>
          {data?.fakeLoggedInAnimal ? (
            <Link href="/logout">Logout</Link>
          ) : (
            <Link href="/login">Login</Link>
          )}
        </div>
      </nav>
    </header>
  );
}
