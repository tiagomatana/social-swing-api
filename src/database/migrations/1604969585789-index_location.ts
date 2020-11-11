import {MigrationInterface} from "typeorm";
import {MongoQueryRunner} from "typeorm/driver/mongodb/MongoQueryRunner";

export class indexLocation1604969585789 implements MigrationInterface {

    public async up(queryRunner: MongoQueryRunner): Promise<void> {
        await queryRunner.createCollectionIndex("locations", {location: "2dsphere"});
    }

    public async down(queryRunner: MongoQueryRunner): Promise<void> {
        await queryRunner.dropCollectionIndex('locations', 'location_2dsphere');
    }

}
