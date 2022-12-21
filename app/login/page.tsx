import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LoginHandler from './LoginHandler';

export default function Login() {
  const fakeToken = cookies().get('fakeSessionToken');

  if (fakeToken?.value) {
    redirect('/admin-animal');
  }

  return <LoginHandler />;
}
