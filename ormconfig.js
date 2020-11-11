module.exports = {
    type: 'mongodb',
    name: 'default',
    url: process.env.DATABASE_URL || "mongodb+srv://userdev:qIEGvDD9Ha9zXjVQ@clusterdev.w7ke8.gcp.mongodb.net/brasilswing?retryWrites=true&w=majority",
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