const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class userBannedDate1623104077078 {
  name = 'userBannedDate1623104077078';

  async up(queryRunner) {
    await queryRunner.query(`ALTER TABLE "user" ADD "bannedDate" TIMESTAMP`);
  }

  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "bannedDate"`);
  }
};
