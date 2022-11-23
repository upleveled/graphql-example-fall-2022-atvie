const animals = [
  {
    id: 1,
    name: 'Ralph',
    type: 'Tiger',
    accessory: 'Gold chain',
  },
  {
    id: 2,
    name: 'Evelina',
    type: 'Hedgehog',
    accessory: 'Comb',
  },
  {
    id: 3,
    name: 'Otto',
    type: 'Otter',
    accessory: 'Stone',
  },
  {
    id: 4,
    name: 'Mayo',
    type: 'Dog',
    accessory: 'Sweater',
  },
  {
    id: 5,
    name: 'Kaaaarl',
    type: 'Llama',
    accessory: 'Toque',
  },
  {
    id: 6,
    name: 'Lulu',
    type: 'Dog',
    accessory: 'Toque',
  },
];

export async function up(sql) {
  await sql`
    INSERT INTO animals ${sql(animals, 'name', 'type', 'accessory')}
  `;
}

export async function down(sql) {
  for (const animal of animals) {
    await sql`
      DELETE FROM
        animals
      WHERE
        name = ${animal.name} AND
        type = ${animal.type} AND
        accessory = ${animal.accessory}
    `;
  }
}
