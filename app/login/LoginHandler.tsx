'use client';

import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from '../../styles/Home.module.css';

// log in user mutation
const loginMutation = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      name
      type
      accessory
    }
  }
`;

export default function LoginHandler() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [onError, setOnError] = useState('');
  const router = useRouter();

  const [login] = useMutation(loginMutation);

  // login handler
  async function loginHandler() {
    try {
      const loggedInAnimal = await login({
        variables: {
          username,
          password,
        },
      });

      if (loggedInAnimal.data) {
        await router.push('/admin-animal');
      }
    } catch (error) {
      let message;
      if (error instanceof Error) {
        message = error.message;
      } else {
        message = String(error);
      }
      setOnError(message);
    }
  }

  return (
    <div className={styles.container}>
      <h1>Login</h1>
      <div>
        <label>
          username
          <input
            value={username}
            onChange={(event) => {
              setUsername(event.currentTarget.value);
            }}
          />
        </label>
        <br />
        <label>
          password
          <input
            value={password}
            onChange={(event) => {
              setPassword(event.currentTarget.value);
            }}
          />
        </label>
        <button
          onClick={async () => {
            await loginHandler();
          }}
        >
          Login
        </button>
      </div>
      <div className={styles.error}>{onError}</div>
    </div>
  );
}
