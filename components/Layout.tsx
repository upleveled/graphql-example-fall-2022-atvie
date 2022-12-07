import Head from 'next/head';
import Header from './Header';

type LayoutProps = { children: React.ReactNode };

export default function Layout(props: LayoutProps) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main>{props.children}</main>
    </>
  );
}
