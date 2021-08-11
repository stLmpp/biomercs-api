const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class userPlayerMaxLength1628684828625 {
  name = 'userPlayerMaxLength1628684828625';

  async up(queryRunner) {
    // personaName
    await queryRunner.query(`ALTER TABLE "public"."player" DROP CONSTRAINT "UQ_2cc68df9fcd52298ba2d522dea9"`);
    await queryRunner.query(`ALTER TABLE "public"."player" ADD "personaName2" character varying(100)`);
    await queryRunner.query(`UPDATE "public"."player" set "personaName2" = "personaName"`);
    await queryRunner.query(`ALTER TABLE "public"."player" DROP COLUMN "personaName"`);
    await queryRunner.query(`ALTER TABLE "public"."player" RENAME "personaName2" TO "personaName"`);
    await queryRunner.query(`ALTER TABLE "public"."player" ALTER "personaName" SET NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "public"."player" ADD CONSTRAINT "UQ_2cc68df9fcd52298ba2d522dea9" UNIQUE ("personaName")`
    );

    // title and aboutMe
    await queryRunner.query(`ALTER TABLE "public"."player" DROP COLUMN "title"`);
    await queryRunner.query(`ALTER TABLE "public"."player" ADD "title" character varying(250)`);
    await queryRunner.query(`ALTER TABLE "public"."player" DROP COLUMN "aboutMe"`);
    await queryRunner.query(`ALTER TABLE "public"."player" ADD "aboutMe" character varying(2000)`);

    // username
    await queryRunner.query(`ALTER TABLE "public"."user" DROP CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb"`);
    await queryRunner.query(`ALTER TABLE "public"."user" ADD "username2" character varying(100)`);
    await queryRunner.query(`UPDATE "public"."user" SET "username2" = "username"`);
    await queryRunner.query(`ALTER TABLE "public"."user" DROP COLUMN "username"`);
    await queryRunner.query(`ALTER TABLE "public"."user" RENAME "username2" to "username"`);
    await queryRunner.query(`ALTER TABLE "public"."user" ALTER "username" SET NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "public"."user" ADD CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username")`
    );
  }

  async down(queryRunner) {
    // username
    await queryRunner.query(`ALTER TABLE "public"."user" DROP CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb"`);
    await queryRunner.query(`ALTER TABLE "public"."user" ADD "username2" character varying NOT NULL`);
    await queryRunner.query(`UPDATE "public"."user" SET "username2" = "username"`);
    await queryRunner.query(`ALTER TABLE "public"."user" DROP COLUMN "username"`);
    await queryRunner.query(`ALTER TABLE "public"."user" RENAME "username2" TO "username"`);
    await queryRunner.query(
      `ALTER TABLE "public"."user" ADD CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username")`
    );

    // title and aboutMe
    await queryRunner.query(`ALTER TABLE "public"."player" DROP COLUMN "aboutMe"`);
    await queryRunner.query(`ALTER TABLE "public"."player" ADD "aboutMe" character varying`);
    await queryRunner.query(`ALTER TABLE "public"."player" DROP COLUMN "title"`);
    await queryRunner.query(`ALTER TABLE "public"."player" ADD "title" character varying`);

    // personaName
    await queryRunner.query(`ALTER TABLE "public"."player" DROP CONSTRAINT "UQ_2cc68df9fcd52298ba2d522dea9"`);
    await queryRunner.query(`ALTER TABLE "public"."player" ADD "personaName2" character varying NOT NULL`);
    await queryRunner.query(`UPDATE "public"."player" SET "personaName2" = "personaName"`);
    await queryRunner.query(`ALTER TABLE "public"."player" DROP COLUMN "personaName"`);
    await queryRunner.query(`ALTER TABLE "public"."player" RENAME "personaName2" TO "personaName"`);
    await queryRunner.query(
      `ALTER TABLE "public"."player" ADD CONSTRAINT "UQ_2cc68df9fcd52298ba2d522dea9" UNIQUE ("personaName")`
    );
  }
};
