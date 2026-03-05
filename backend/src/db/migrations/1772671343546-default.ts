import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1772671343546 implements MigrationInterface {
    name = 'Default1772671343546'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`usuarios\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nome\` varchar(100) NOT NULL, \`login\` varchar(100) NOT NULL, \`senha\` varchar(255) NOT NULL, \`criado_em\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`alterado_em\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_0c0fcf4a8c228628476a29ea30\` (\`login\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_0c0fcf4a8c228628476a29ea30\` ON \`usuarios\``);
        await queryRunner.query(`DROP TABLE \`usuarios\``);
    }

}
