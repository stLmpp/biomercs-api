const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class notificationTypeData1629335412310 {
  /**
   * @param { QueryRunner } queryRunner
   * @returns {Promise<void>}
   */
  async up(queryRunner) {
    await queryRunner.query(`alter sequence main.notification_type_id_seq restart with 1`);
    await queryRunner.query(`
      insert into main.notification_type ("createdBy", "lastUpdatedBy", content) values 
        (-1, -1, 'Your score was approved :)'),
        (-1, -1, 'Your score was rejected :('),
        (-1, -1, 'An admin requested changes to your score'),
        (-1, -1, 'Someone submitted a score with you as partner')
    `);
  }

  /**
   * @param { QueryRunner } queryRunner
   * @returns {Promise<void>}
   */
  async down(queryRunner) {
    await queryRunner.query(`alter sequence main.notification_type_id_seq restart with 1`);
    await queryRunner.query(`delete from main.notification_type`);
  }
};
