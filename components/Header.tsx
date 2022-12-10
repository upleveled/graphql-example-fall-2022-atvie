import Link from 'next/link';
import styles from '../styles/Home.module.css';

type HeaderProps = { animal?: { name: string } };

export default function Header(props: HeaderProps) {
  return (
    <header>
      <nav className={styles.header}>
        <div>
          <Link href="/">Home</Link>
          <Link href="/create-animal">Create Animal</Link>
          <Link href="/admin-animal">Admin Animal</Link>
        </div>
        <div>
          {props.animal?.name === 'Ralph' ? (
            <Link href="/logout">Logout</Link>
          ) : (
            <Link href="/login">Login</Link>
          )}
        </div>
      </nav>
    </header>
  );
}
