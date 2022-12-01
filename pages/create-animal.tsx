import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from '../styles/Home.module.css';

const createAnimal = gql`
  mutation CreateAnimal($name: String!, $type: String!, $accessory: String!) {
    createAnimal(name: $name, type: $type, accessory: $accessory) {
      id
      name
      type
      accessory
    }
  }
`;

export default function CreateAnimalPage() {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [accessory, setAccessory] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();

  const [newAnimal] = useMutation(createAnimal);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const animal = await newAnimal({
        variables: {
          name,
          type,
          accessory,
        },
      });

      if (animal.data) {
        await router.push('/');
      }
    } catch (err) {
      let message;
      if (err instanceof Error) {
        message = err.message;
      } else {
        message = String(err);
      }
      setError(message);
    }
  }

  return (
    <>
      <Head>
        <title>Create Animal</title>
        <meta name="description" content="Create new animal" />
      </Head>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formItems}>
          <label>
            Name
            <input onChange={(event) => setName(event.currentTarget.value)} />
          </label>

          <label>
            Type
            <input onChange={(event) => setType(event.currentTarget.value)} />
          </label>

          <label>
            Accessory
            <input
              onChange={(event) => setAccessory(event.currentTarget.value)}
            />
          </label>
          <p className={styles.error}>{error}</p>
          <button>Create Animal</button>
        </div>
      </form>
    </>
  );
}
