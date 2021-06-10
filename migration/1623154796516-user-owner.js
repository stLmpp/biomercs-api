const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class userOwner1623154796516 {
  name = 'userOwner1623154796516';

  async up(queryRunner) {
    await queryRunner.query(`ALTER TABLE "user" ADD "owner" boolean NOT NULL DEFAULT false`);
  }

  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "owner"`);
  }
};
