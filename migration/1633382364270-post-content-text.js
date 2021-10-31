const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class postContentText1633382364270 {
  name = 'postContentText1633382364270';

  async up(queryRunner) {
    await queryRunner.query(`ALTER TABLE "forum"."post" DROP COLUMN "content"`);
    await queryRunner.query(`ALTER TABLE "forum"."post" ADD "content" text`);
    await queryRunner.query(`UPDATE "forum"."post" SET "content" = ''`);
    await queryRunner.query(`ALTER TABLE "forum"."post" ALTER COLUMN "content" SET NOT NULL`);
  }

  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "forum"."post" DROP COLUMN "content"`);
    await queryRunner.query(`ALTER TABLE "forum"."post" ADD "content" json`);
    await queryRunner.query(`UPDATE "forum"."post" SET "content" = '{}'`);
    await queryRunner.query(`ALTER TABLE "forum"."post" ALTER COLUMN "content" SET NOT NULL`);
  }
};
