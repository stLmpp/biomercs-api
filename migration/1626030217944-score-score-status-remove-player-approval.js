const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class scoreScoreStatusRemovePlayerApproval1626030217944 {
  /**
   * @param { QueryRunner } queryRunner
   * @returns {Promise<void>}
   */
  async up(queryRunner) {
    await queryRunner.query(`UPDATE "score" SET "idScoreStatus" = 2 WHERE "idScoreStatus" = 3`);
    await queryRunner.query(`UPDATE "score" SET "idScoreStatus" = 3 WHERE "idScoreStatus" IN (4, 5)`);
    await queryRunner.query(`UPDATE "score" SET "idScoreStatus" = 4 WHERE "idScoreStatus" = 6`);
    await queryRunner.query(
      `UPDATE "score_status" SET "description" = (SELECT "description" FROM "score_status" WHERE "id" = 4) WHERE "id" = 3`
    );
    await queryRunner.query(
      `UPDATE "score_status" SET "description" = (SELECT "description" FROM "score_status" WHERE "id" = 6) WHERE "id" = 4`
    );
    await queryRunner.query(`UPDATE "score_status" SET "description" = 'Rejected' WHERE "id" = 2`);
    await queryRunner.query(`UPDATE "score_status" SET "description" = 'Awaiting Approval' WHERE "id" = 3`);
    await queryRunner.query(`DELETE FROM "score_status" WHERE "id" in (5, 6)`);
  }

  /**
   * @param { QueryRunner } queryRunner
   * @returns {Promise<void>}
   */
  async down(queryRunner) {}
};
