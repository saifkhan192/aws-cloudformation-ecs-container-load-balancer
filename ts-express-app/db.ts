import { exit } from 'process';
import { DataSource, DataSourceOptions } from 'typeorm';

const commonOptions: DataSourceOptions = {
  type: 'postgres',
  port: 5432,

  host: process.env.POSTGRES_DB_HOST,
  username: process.env.POSTGRES_DB_USERNAME,
  password: process.env.POSTGRES_DB_PASSWORD,
  database: process.env.POSTGRES_DB_NAME,

  entities: [__dirname + '/entity/*.{js,ts}'],
  logging: process.env.NODE_ENV !== 'production',
  synchronize: process.env.NODE_ENV !== 'production',

  // migrations: ['src/migrations/**/*{.ts,.js}'],
  // subscribers: ['src/subscribers/**/*{.ts,.js}'],
};

const AppDataSourceOptions: DataSourceOptions =
  process.env.NODE_ENV === 'production'
    ? {
        ...commonOptions,
        synchronize: false,
      }
    : {
        ...commonOptions,
        synchronize: true,
      };

export const createDatabaseConnection = (): Promise<DataSource> => {
  const AppDataSource = new DataSource(AppDataSourceOptions);
  return AppDataSource.initialize();
};

export const establishDatabaseConnection = async (): Promise<void> => {
  try {
    await createDatabaseConnection();
    console.log('DB is connected.');
  } catch (error) {
    console.log('DB Connect Error:', error);
    exit();
  }
};
