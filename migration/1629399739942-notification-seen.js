const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class notificationSeen1629399739942 {
  name = 'notificationSeen1629399739942';

  async up(queryRunner) {
    await queryRunner.query(`ALTER TABLE "main"."notification" ADD "seen" boolean NOT NULL DEFAULT false`);
  }

  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "main"."notification" DROP COLUMN "seen"`);
  }
};
