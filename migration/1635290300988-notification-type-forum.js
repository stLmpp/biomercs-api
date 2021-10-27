const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class notificationTypeForum1635290300988 {
  async up(queryRunner) {
    await queryRunner.query(`
      insert into main.notification_type ("createdBy", "lastUpdatedBy", content) values 
        (-1, -1, 'Someone replied to a topic you are subscribed')
    `);
  }

  async down(queryRunner) {}
};
