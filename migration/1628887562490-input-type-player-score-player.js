const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class inputTypePlayerScorePlayer1628887562490 {
    name = 'inputTypePlayerScorePlayer1628887562490'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "input_type" ("creationDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP DEFAULT now(), "createdBy" integer NOT NULL, "lastUpdatedBy" integer, "id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_44bfcb298397df7f65acffa0532" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "public"."player" ADD "idInputType" integer`);
        await queryRunner.query(`ALTER TABLE "public"."score_player" ADD "idInputType" integer`);
        await queryRunner.query(`ALTER TABLE "public"."player" ADD CONSTRAINT "FK_40c3ca1bbdca3a848268576938d" FOREIGN KEY ("idInputType") REFERENCES "input_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."score_player" ADD CONSTRAINT "FK_6303bb0bceba09ba7980b6e0dd4" FOREIGN KEY ("idInputType") REFERENCES "input_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "public"."score_player" DROP CONSTRAINT "FK_6303bb0bceba09ba7980b6e0dd4"`);
        await queryRunner.query(`ALTER TABLE "public"."player" DROP CONSTRAINT "FK_40c3ca1bbdca3a848268576938d"`);
        await queryRunner.query(`ALTER TABLE "public"."score_player" DROP COLUMN "idInputType"`);
        await queryRunner.query(`ALTER TABLE "public"."player" DROP COLUMN "idInputType"`);
        await queryRunner.query(`DROP TABLE "input_type"`);
    }
}
