const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class scoreAchievedDate1626747646780 {
  name = 'scoreAchievedDate1626747646780';

  async up(queryRunner) {
    await queryRunner.query(`ALTER TABLE "score" ADD "achievedDate" TIMESTAMP`);
  }

  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "score" DROP COLUMN "achievedDate"`);
  }
};
