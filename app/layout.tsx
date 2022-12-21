'use client';

import '../styles/globals.css';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import Header from '../components/Header';

const cache: InMemoryCache = new InMemoryCache({});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  uri: `${baseUrl}/graphql`,
  credentials: 'same-origin',
});

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout(props: LayoutProps) {
  return (
    <html lang="en">
      <body>
        <ApolloProvider client={client}>
          <Header />
          {props.children}
        </ApolloProvider>
      </body>
    </html>
  );
}
