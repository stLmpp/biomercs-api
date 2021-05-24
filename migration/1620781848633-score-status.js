const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class scoreStatus1620781848633 {
  name = 'scoreStatus1620781848633';

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE "score_status" ("id" SERIAL NOT NULL, "creationDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP DEFAULT now(), "createdBy" integer NOT NULL, "lastUpdatedBy" integer, "description" character varying NOT NULL, CONSTRAINT "PK_8271f9f4e765566dbdf8b133e25" PRIMARY KEY ("id"))`
    );
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE "score_status"`);
  }
};
