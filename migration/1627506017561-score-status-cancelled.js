const { MigrationInterface, QueryRunner } = require('typeorm');
const { ScoreStatusEnum } = require('../dist/src/score/score-status/score-status.enum');

module.exports = class scoreStatusCancelled1627506017561 {
  /**
   * @param { QueryRunner } queryRunner
   * @returns {Promise<void>}
   */
  async up(queryRunner) {
    await queryRunner.query(`alter sequence score_status_id_seq restart with ${ScoreStatusEnum.ChangesRequested + 1};`);
    await queryRunner.query(
      `insert into score_status ("createdBy", "lastUpdatedBy", description) values (-1, -1, 'Cancelled');`
    );
  }

  /**
   * @param { QueryRunner } queryRunner
   * @returns {Promise<void>}
   */
  async down(queryRunner) {
    await queryRunner.query(`alter sequence score_status_id_seq restart with ${ScoreStatusEnum.ChangesRequested + 1};`);
    await queryRunner.query(`delete from score_status where id = ${ScoreStatusEnum.ChangesRequested + 1}`);
  }
};
