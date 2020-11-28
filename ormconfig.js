module.exports = {
    type: 'mongodb',
    url: process.env.DATABASE_URL || 'mongodb://userdev:qIEGvDD9Ha9zXjVQ@localhost/brasilswing?retryWrites=true&w=majority',
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