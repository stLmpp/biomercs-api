const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class notificationExtra1635251847051 {
  name = 'notificationExtra1635251847051';

  async up(queryRunner) {
    await queryRunner.query(`ALTER TABLE "main"."notification" DROP CONSTRAINT "FK_517458a0ba74630576c66a9a3ad"`);
    await queryRunner.query(`ALTER TABLE "main"."notification" RENAME COLUMN "idScore" TO "extra"`);
    await queryRunner.query(`ALTER TABLE "main"."notification" DROP COLUMN "extra"`);
    await queryRunner.query(`ALTER TABLE "main"."notification" ADD "extra" json`);
  }

  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "main"."notification" DROP COLUMN "extra"`);
    await queryRunner.query(`ALTER TABLE "main"."notification" ADD "extra" integer`);
    await queryRunner.query(`ALTER TABLE "main"."notification" RENAME COLUMN "extra" TO "idScore"`);
    await queryRunner.query(
      `ALTER TABLE "main"."notification" ADD CONSTRAINT "FK_517458a0ba74630576c66a9a3ad" FOREIGN KEY ("idScore") REFERENCES "main"."score"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
};
