const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class errorSqlParameters1627062152409 {
  name = 'errorSqlParameters1627062152409';

  async up(queryRunner) {
    await queryRunner.query(`ALTER TABLE "error" DROP COLUMN "sqlParameters"`);
    await queryRunner.query(`ALTER TABLE "error" ADD "sqlParameters" json`);
  }

  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "error" DROP COLUMN "sqlParameters"`);
    await queryRunner.query(`ALTER TABLE "error" ADD "sqlParameters" character varying array`);
  }
};
