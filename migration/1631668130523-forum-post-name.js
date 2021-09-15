const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class forumPostName1631668130523 {
  name = 'forumPostName1631668130523';

  async up(queryRunner) {
    await queryRunner.query(`ALTER TABLE "forum"."post" ADD "name" character varying(500)`);
    await queryRunner.query(
      `UPDATE "forum"."post" SET "name" = (SELECT 'RE: ' || "topic"."name" FROM "forum"."topic" WHERE "topic"."id" = "post"."idTopic")`
    );
    await queryRunner.query(`ALTER TABLE "forum"."post" ALTER COLUMN "name" SET NOT NULL`);
  }

  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "forum"."post" DROP COLUMN "name"`);
  }
};
