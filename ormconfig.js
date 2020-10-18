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
        process.env.TYPEORM_MIGRATIONS || './src/database/migrations/*.ts'
    ],
    entities: [
        process.env.TYPEORM_ENTITIES || './src/models/*.ts'
    ],
    cli: {
      migrationsDir: process.env.TYPEORM_MIGRATIONS_DIR || './src/database/migrations',
      entitiesDir: './src/models'
    }
  }
