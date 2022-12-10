import Head from 'next/head';
import Header from './Header';

type LayoutProps = {
  animal?: { name: string } | undefined;
  children: React.ReactNode;
};

export default function Layout(props: LayoutProps) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header animal={props.animal} />

      <main>{props.children}</main>
    </>
  );
}
