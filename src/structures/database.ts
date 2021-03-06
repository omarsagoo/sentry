import { ConnectionManager } from 'typeorm';
import { dbName, dbHost, dbUsername, dbPassword } from '../config';
import path from 'path';

const connectionManager: ConnectionManager = new ConnectionManager();

connectionManager.create({
  name: dbName,
  type: 'postgres',
  host: dbHost,
  port: 5432,
  username: dbUsername,
  password: dbPassword,
  database: 'sentry',
  synchronize: true, // TODO: Disable this for production through use of env variable
  logging: false,
  entities: [path.join(__dirname, '..', 'models') + '/**{.ts,.js}'],
});

export default connectionManager;
