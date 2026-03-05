import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1772677440322 implements MigrationInterface {
    name = 'Default1772677440322'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`categorias\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`nome\` varchar(100) NOT NULL, UNIQUE INDEX \`IDX_de8a2d8979f7820616e31dc1e1\` (\`nome\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`receitas\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`nome\` varchar(45) NOT NULL, \`tempo_preparo_minutos\` int UNSIGNED NOT NULL, \`porcoes\` int UNSIGNED NOT NULL, \`modo_preparo\` text NOT NULL, \`ingredientes\` text NOT NULL, \`id_usuarios\` int UNSIGNED NOT NULL, \`id_categorias\` int UNSIGNED NOT NULL, \`criado_em\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`alterado_em\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`usuarios\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`nome\` varchar(100) NOT NULL, \`login\` varchar(100) NOT NULL, \`senha\` varchar(255) NOT NULL, \`criado_em\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`alterado_em\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_0c0fcf4a8c228628476a29ea30\` (\`login\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`receitas\` ADD CONSTRAINT \`FK_83d2421af08b206b25652b8b918\` FOREIGN KEY (\`id_usuarios\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`receitas\` ADD CONSTRAINT \`FK_899b9b570973f9f995ace4f74d3\` FOREIGN KEY (\`id_categorias\`) REFERENCES \`categorias\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`receitas\` DROP FOREIGN KEY \`FK_899b9b570973f9f995ace4f74d3\``);
        await queryRunner.query(`ALTER TABLE \`receitas\` DROP FOREIGN KEY \`FK_83d2421af08b206b25652b8b918\``);
        await queryRunner.query(`DROP INDEX \`IDX_0c0fcf4a8c228628476a29ea30\` ON \`usuarios\``);
        await queryRunner.query(`DROP TABLE \`usuarios\``);
        await queryRunner.query(`DROP TABLE \`receitas\``);
        await queryRunner.query(`DROP INDEX \`IDX_de8a2d8979f7820616e31dc1e1\` ON \`categorias\``);
        await queryRunner.query(`DROP TABLE \`categorias\``);
    }

}
