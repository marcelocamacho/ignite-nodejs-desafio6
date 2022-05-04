import { Connection, createConnection, getConnectionOptions } from 'typeorm';

//(async () => await createConnection())();

export default async (host: string): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  return createConnection(
    Object.assign(defaultOptions, {
      host: "db_ignite_desafio_6",
      database: "fin_api"
    })
  );
};
