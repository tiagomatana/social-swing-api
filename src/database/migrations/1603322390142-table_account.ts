import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class tableAccount1603322390142 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'accounts',
      columns: [
        {
          name: 'id',
          type: 'integer',
          unsigned: true,
          isPrimary: true,
          isGenerated: true,
          generationStrategy: "increment"
        },
        {
          name: 'name',
          type: 'varchar'
        },
        {
          name: 'surname',
          type: 'varchar'
        },
        {
          name: 'email',
          type: 'varchar'
        },
        {
          name: 'birthdate',
          type: 'date'
        },
        {
          name: 'password',
          type: 'varchar'
        },
        {
          name: 'genre',
          type: 'varchar'
        },
        {
          name: 'last_login',
          type: 'timestamp',
          default: 'CURRENT_TIMESTAMP'
        },
        {
          name: 'active',
          type: 'boolean',
          default: false,
          isNullable: true
        },
        {
          name: 'is_administrator',
          type: 'boolean',
          default: false,
          isNullable: true
        },
        {
          name: 'is_blocked',
          type: 'boolean',
          default: false,
          isNullable: true
        },
        {
          name: 'sex_orientation',
          type: 'varchar',
          isNullable: true
        },
        {
          name: 'relationship',
          type: 'varchar',
          isNullable: true
        },
        {
          name: 'about',
          type: 'text',
          isNullable: true
        },
        {
          name: 'photo',
          type: 'varchar',
          isNullable: true
        },
      ],
      uniques: [{
        name: 'email_idx',
        columnNames: ['email']
      }]
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('accounts')
  }

}
