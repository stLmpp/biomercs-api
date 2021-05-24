const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class playerUpdatePersonaName1621638418557 {
    name = 'playerUpdatePersonaName1621638418557'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "player" ADD "lastUpdatedPersonaNameDate" TIMESTAMP`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "player" DROP COLUMN "lastUpdatedPersonaNameDate"`);
    }
}
