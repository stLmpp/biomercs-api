const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class scoreApprovalMotive1620692118026 {
  /**
   * @param { QueryRunner } queryRunner
   * @returns {Promise<void>}
   */
  async up(queryRunner) {
    await queryRunner.query(`
        INSERT INTO score_approval_motive ("createdBy", "lastUpdatedBy", description, action) VALUES 
            (-1, -1, 'Evidenced by video', 'Approve'),
            (-1, -1, 'Lack of evidence', 'Reject'),
            (-1, -1, 'Evidenced by screenshot (low scores only)', 'Approve'),
            (-1, -1, 'Suspected cheat', 'Reject'),
            (-1, -1, 'Other', 'Approve'),
            (-1, -1, 'Other', 'Reject');
        `);
  }

  /**
   * @param { QueryRunner } queryRunner
   * @returns {Promise<void>}
   */
  async down(queryRunner) {
    await queryRunner.query(`delete from score_approval_motive;`);
  }
};
