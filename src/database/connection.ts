import {createConnection, getConnection} from "typeorm";

// createConnection();

const connection = {
    async create(){
        await createConnection();
    },

    async close(){
        await getConnection().close();
    },

    clear(){
        const connection = getConnection();
        const entities = connection.entityMetadatas;

        entities.forEach(async (entity) => {
            console.log(entity.name)
            // const repository = connection.getRepository(entity.name);
            // await repository.delete(`DELETE FROM ${entity.tableName}`);
        });
    },
};
export default connection;