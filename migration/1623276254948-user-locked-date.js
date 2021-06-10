const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class userLockedDate1623276254948 {
  name = 'userLockedDate1623276254948';

  async up(queryRunner) {
    await queryRunner.query(`ALTER TABLE "user" ADD "lockedDate" TIMESTAMP`);
  }

  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lockedDate"`);
  }
};
