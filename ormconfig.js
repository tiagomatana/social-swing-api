module.exports = {
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: 5432,
    database: process.env.DATABASE_NAME || 'socialswing',
    username: process.env.DATABASE_USER || 'postgres',
    dropSchema: false,
    password: process.env.DATABASE_PASSWORD || 'docker',
    synchronize: true,
    migrations: [
      './src/database/migrations/*.ts'
    ],
    entities: [
      './src/models/*.ts'
    ],
    cli: {
      migrationsDir: './src/database/migrations',
      entitiesDir: './src/models'
    }
  }
