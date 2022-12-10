import { GetServerSidePropsContext } from 'next';

function deleteMockSerializedCookie() {
  return "fakeSessionToken= ''; Path=/; Max-Age= -1";
}

export default function Logout() {
  return null;
}

export function getServerSideProps(context: GetServerSidePropsContext) {
  const fakeToken = context.req.cookies.fakeSessionToken;

  if (fakeToken) {
    context.res.setHeader('Set-Cookie', deleteMockSerializedCookie());
  }

  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };
}
