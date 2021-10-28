const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class platformInputType1629570392650 {
  name = 'platformInputType1629570392650';

  async up(queryRunner) {
    await queryRunner.query(`ALTER TABLE "main"."score_player" DROP CONSTRAINT "FK_6303bb0bceba09ba7980b6e0dd4"`);
    await queryRunner.query(`UPDATE "main"."score_player" SET "idInputType" = null`);
    await queryRunner.query(`ALTER TABLE "main"."score_player" RENAME COLUMN "idInputType" TO "idPlatformInputType"`);
    await queryRunner.query(
      `CREATE TABLE "main"."platform_input_type" ("creationDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP DEFAULT now(), "createdBy" integer NOT NULL, "lastUpdatedBy" integer, "id" SERIAL NOT NULL, "idInputType" integer NOT NULL, "idPlatform" integer NOT NULL, CONSTRAINT "UQ_dd07f8f9e849818e67cc5ec9dee" UNIQUE ("idInputType", "idPlatform"), CONSTRAINT "PK_a3d9d9b01bea7aa1aebcde55452" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "main"."platform_input_type" ADD CONSTRAINT "FK_450a95e1a4500bd4fb5086c5ad0" FOREIGN KEY ("idInputType") REFERENCES "main"."input_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "main"."platform_input_type" ADD CONSTRAINT "FK_f05bc66a92ccfd5f766b9c0503c" FOREIGN KEY ("idPlatform") REFERENCES "main"."platform"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "main"."score_player" ADD CONSTRAINT "FK_344f0514834b40f647da7989b81" FOREIGN KEY ("idPlatformInputType") REFERENCES "main"."platform_input_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "main"."score_player" DROP CONSTRAINT "FK_344f0514834b40f647da7989b81"`);
    await queryRunner.query(
      `ALTER TABLE "main"."platform_input_type" DROP CONSTRAINT "FK_f05bc66a92ccfd5f766b9c0503c"`
    );
    await queryRunner.query(
      `ALTER TABLE "main"."platform_input_type" DROP CONSTRAINT "FK_450a95e1a4500bd4fb5086c5ad0"`
    );
    await queryRunner.query(`DROP TABLE "main"."platform_input_type"`);
    await queryRunner.query(`UPDATE "main"."score_player" SET "idPlatformInputType" = null`);
    await queryRunner.query(`ALTER TABLE "main"."score_player" RENAME COLUMN "idPlatformInputType" TO "idInputType"`);
    await queryRunner.query(
      `ALTER TABLE "main"."score_player" ADD CONSTRAINT "FK_6303bb0bceba09ba7980b6e0dd4" FOREIGN KEY ("idInputType") REFERENCES "main"."input_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
};
