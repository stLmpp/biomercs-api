const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class notificationDeletedDate1629485460386 {
  name = 'notificationDeletedDate1629485460386';

  async up(queryRunner) {
    await queryRunner.query(`ALTER TABLE "main"."notification" ADD "deletedDate" TIMESTAMP`);
  }

  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "main"."notification" DROP COLUMN "deletedDate"`);
  }
};
