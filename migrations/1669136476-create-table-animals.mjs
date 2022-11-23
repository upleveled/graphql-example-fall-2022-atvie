export async function up(sql) {
  await sql`
    CREATE TABLE animals (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      name varchar(30) NOT NULL,
      type varchar(30) NOT NULL,
      accessory varchar(40) NOT NULL
    )
  `;
}

export async function down(sql) {
  await sql`
    DROP TABLE animals
  `;
}
