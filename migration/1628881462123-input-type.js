const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class inputType1628881462123 {
    name = 'inputType1628881462123'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "input_type" ("creationDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP DEFAULT now(), "createdBy" integer NOT NULL, "lastUpdatedBy" integer, "id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_44bfcb298397df7f65acffa0532" PRIMARY KEY ("id"))`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "input_type"`);
    }
}
