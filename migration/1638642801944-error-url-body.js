const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class errorUrlBody1638642801944 {
    name = 'errorUrlBody1638642801944'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "main"."error" ADD "url" character varying`);
        await queryRunner.query(`ALTER TABLE "main"."error" ADD "body" json`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "main"."error" DROP COLUMN "body"`);
        await queryRunner.query(`ALTER TABLE "main"."error" DROP COLUMN "url"`);
    }
}
