import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Header() {
  return (
    <header>
      <nav className={styles.header}>
        <div>
          <Link href="/">Home</Link>
          <Link href="/create-animal">Create Animal</Link>
          <Link href="/animal-admin">Admin Animal</Link>
        </div>
        <div>
          <Link href="/login">Login</Link>
        </div>
      </nav>
    </header>
  );
}
