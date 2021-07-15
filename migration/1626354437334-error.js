const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class error1626354437334 {
  name = 'error1626354437334';

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE "error" ("creationDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP DEFAULT now(), "createdBy" integer NOT NULL, "lastUpdatedBy" integer, "id" SERIAL NOT NULL, "name" character varying NOT NULL, "message" character varying NOT NULL, "stack" text NOT NULL, "sqlCode" character varying, "sqlHint" character varying, "sqlQuery" text, "sqlParameters" character varying array, CONSTRAINT "PK_cd77c9331f0ee047b819a7abad1" PRIMARY KEY ("id"))`
    );
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE "error"`);
  }
};
