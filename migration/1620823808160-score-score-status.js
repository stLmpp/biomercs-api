const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class scoreScoreStatus1620823808160 {
  name = 'scoreScoreStatus1620823808160';

  /**
   * @param { QueryRunner } queryRunner
   * @returns {Promise<void>}
   */
  async up(queryRunner) {
    await queryRunner.query(`DROP INDEX "IDX_89d413dd56853dc54ff3f86640"`);
    await queryRunner.query(`ALTER TABLE "score" ADD "idScoreStatus" integer NULL`);
    await queryRunner.query(`UPDATE "score" SET "idScoreStatus" = 1 where "status" = 'Approved'`);
    await queryRunner.query(`UPDATE "score" SET "idScoreStatus" = 2 where "status" = 'Rejected by Admin'`);
    await queryRunner.query(`UPDATE "score" SET "idScoreStatus" = 3 where "status" = 'Rejected by Partner'`);
    await queryRunner.query(`UPDATE "score" SET "idScoreStatus" = 4 where "status" = 'Awaiting Approval of Admin'`);
    await queryRunner.query(`UPDATE "score" SET "idScoreStatus" = 5 where "status" = 'Awaiting Approval of Partner'`);
    await queryRunner.query(`UPDATE "score" SET "idScoreStatus" = 6 where "status" = 'Changes Requested'`);
    await queryRunner.query(`ALTER TABLE "score" ALTER COLUMN "idScoreStatus" SET NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "score" ADD CONSTRAINT "FK_8964b25e43cf798edfa2a1a462f" FOREIGN KEY ("idScoreStatus") REFERENCES "score_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(`ALTER TABLE "score" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "score_status_enum"`);
  }

  /**
   * @param { QueryRunner } queryRunner
   * @returns {Promise<void>}
   */
  async down(queryRunner) {
    await queryRunner.query(
      `CREATE TYPE "public"."score_status_enum" AS ENUM ('Approved', 'Rejected by Admin', 'Rejected by Partner', 'Awaiting Approval of Admin', 'Awaiting Approval of Partner', 'Changes Requested')`
    );
    await queryRunner.query(`ALTER TABLE "score" ADD "status" "score_status_enum" NULL`);
    await queryRunner.query(`UPDATE "score" set "status" = 'Approved' WHERE "idScoreStatus" = 1;`);
    await queryRunner.query(`UPDATE "score" set "status" = 'Rejected by Admin' WHERE "idScoreStatus" = 2;`);
    await queryRunner.query(`UPDATE "score" set "status" = 'Rejected by Partner' WHERE "idScoreStatus" = 3;`);
    await queryRunner.query(`UPDATE "score" set "status" = 'Awaiting Approval of Admin' WHERE "idScoreStatus" = 4;`);
    await queryRunner.query(`UPDATE "score" set "status" = 'Awaiting Approval of Partner' WHERE "idScoreStatus" = 5;`);
    await queryRunner.query(`UPDATE "score" set "status" = 'Changes Requested' WHERE "idScoreStatus" = 6;`);
    await queryRunner.query(`ALTER TABLE "score" ALTER COLUMN "status" SET NOT NULL`);
    await queryRunner.query(`CREATE INDEX "IDX_89d413dd56853dc54ff3f86640" ON "score" ("status") `);
    await queryRunner.query(`ALTER TABLE "score" DROP CONSTRAINT "FK_8964b25e43cf798edfa2a1a462f"`);
    await queryRunner.query(`ALTER TABLE "score" DROP COLUMN "idScoreStatus"`);
  }
};
