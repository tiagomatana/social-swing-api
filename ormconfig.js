module.exports = {
    type: 'mongodb',
    url: process.env.DATABASE_URL,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    synchronize:true,
    migrations: [
        process.env.TYPEORM_MIGRATIONS || './src/database/migrations/*.ts'
    ],
    entities: [
        process.env.TYPEORM_ENTITIES || './src/models/*.ts'
    ],
    cli: {
        migrationsDir: process.env.TYPEORM_MIGRATIONS_DIR || './src/database/migrations'
    }
}