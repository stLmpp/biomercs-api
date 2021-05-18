const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class scoreStatusData1620790000251 {
  /**
   * @param { QueryRunner } queryRunner
   * @returns {Promise<void>}
   */
  async up(queryRunner) {
    await queryRunner.query(`alter sequence score_status_id_seq restart with 1;`);
    await queryRunner.query(`
        insert into score_status ("createdBy", "lastUpdatedBy", description) values 
           (-1, -1, 'Approved'),
           (-1, -1, 'Rejected by Admin'),
           (-1, -1, 'Rejected by Partner'),
           (-1, -1, 'Awaiting Approval of Admin'),
           (-1, -1, 'Awaiting Approval of Partner'),
           (-1, -1, 'Changes Requested');
       `);
  }

  /**
   * @param { QueryRunner } queryRunner
   * @returns {Promise<void>}
   */
  async down(queryRunner) {
    await queryRunner.query(`alter sequence score_status_id_seq restart with 1;`);
    await queryRunner.query(`delete from score_status;`);
  }
};
