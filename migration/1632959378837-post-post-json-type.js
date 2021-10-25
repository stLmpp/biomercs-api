const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class postPostJsonType1632959378837 {
  name = 'postPostJsonType1632959378837';

  async up(queryRunner) {
    await queryRunner.query(`ALTER TABLE "forum"."post" DROP COLUMN "post"`);
    await queryRunner.query(`ALTER TABLE "forum"."post" ADD "post" json`);
    await queryRunner.query(`UPDATE "forum"."post" SET "post" = '{}'`);
    await queryRunner.query(`ALTER TABLE "forum"."post" ALTER COLUMN "post" SET NOT NULL`);
  }

  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "forum"."post" DROP COLUMN "post"`);
    await queryRunner.query(`ALTER TABLE "forum"."post" ADD "post" character varying(10000)`);
    await queryRunner.query(`UPDATE "forum"."post" SET "post" = ''`);
    await queryRunner.query(`ALTER TABLE "forum"."post" ALTER COLUMN "post" SET NOT NULL`);
  }
};
