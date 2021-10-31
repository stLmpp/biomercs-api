const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class forumCategorySubCategoryOrder1629825213855 {
  name = 'forumCategorySubCategoryOrder1629825213855';

  async up(queryRunner) {
    await queryRunner.query(`ALTER TABLE "forum"."sub_category" ADD "order" integer`);
    await queryRunner.query(`UPDATE forum.sub_category SET "order" = 1`);
    await queryRunner.query(`ALTER TABLE "forum"."category" ADD "order" integer`);
    await queryRunner.query(`UPDATE forum.category SET "order" = 1`);
    await queryRunner.query(`ALTER TABLE forum.sub_category ALTER COLUMN "order" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE forum.category ALTER COLUMN "order" SET NOT NULL`);
  }

  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "forum"."category" DROP COLUMN "order"`);
    await queryRunner.query(`ALTER TABLE "forum"."sub_category" DROP COLUMN "order"`);
  }
};
