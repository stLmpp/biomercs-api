const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class rules1622634553955 {
  name = 'rules1622634553955';

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE "rule" ("creationDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP DEFAULT now(), "createdBy" integer NOT NULL, "lastUpdatedBy" integer, "id" SERIAL NOT NULL, "description" character varying NOT NULL, "order" integer NOT NULL, CONSTRAINT "PK_a5577f464213af7ffbe866e3cb5" PRIMARY KEY ("id"))`
    );
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE "rule"`);
  }
};
