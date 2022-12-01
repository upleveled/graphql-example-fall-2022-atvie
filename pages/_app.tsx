import '../styles/globals.css';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import type { AppProps } from 'next/app';

export const cache: InMemoryCache = new InMemoryCache({});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  uri: `${baseUrl}/graphql`,
  credentials: 'same-origin',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
