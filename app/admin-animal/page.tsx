import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Animal } from '../../database/animals';
import queryGraphql from '../../shared/query-graphql';
import AdminDashboard from './AdminDashboard';

export default async function AnimalsAdmin() {
  const fakeToken = cookies().get('fakeSessionToken');

  // console.log('fakeToken', fakeToken);

  const { fakeLoggedInAnimal } = await queryGraphql(
    `
query($fakeToken: String!) {
  fakeLoggedInAnimal(name: $fakeToken) {
    id
    name
    type
    accessory
  }
}
`,
    { fakeToken: fakeToken?.value },
  );

  if (!fakeLoggedInAnimal) {
    redirect('/login');
  }

  const { animals } = await queryGraphql(`
  query {
      animals {
      id
      name
      type
      accessory
    }
  }
  `);

  return <AdminDashboard animals={animals as Animal[]} />;
}
