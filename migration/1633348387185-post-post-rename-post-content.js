const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class postPostRenamePostContent1633348387185 {
  name = 'postPostRenamePostContent1633348387185';

  async up(queryRunner) {
    await queryRunner.query(`ALTER TABLE "forum"."post" RENAME COLUMN "post" TO "content"`);
  }

  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "forum"."post" RENAME COLUMN "content" TO "post"`);
  }
};
