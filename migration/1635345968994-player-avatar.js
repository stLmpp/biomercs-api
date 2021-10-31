const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class playerAvatar1635345968994 {
    name = 'playerAvatar1635345968994'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "main"."player" ADD "avatar" character varying`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "main"."player" DROP COLUMN "avatar"`);
    }
}
