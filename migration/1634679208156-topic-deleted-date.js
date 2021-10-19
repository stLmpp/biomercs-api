const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class topicDeletedDate1634679208156 {
  name = 'topicDeletedDate1634679208156';

  async up(queryRunner) {
    await queryRunner.query(`ALTER TABLE "forum"."topic" ADD "deletedDate" TIMESTAMP`);
  }

  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "forum"."topic" DROP COLUMN "deletedDate"`);
  }
};
