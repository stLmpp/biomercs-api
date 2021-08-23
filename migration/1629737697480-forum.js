const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class forum1629737697480 {
  name = 'forum1629737697480';

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE "forum"."moderator" ("creationDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP DEFAULT now(), "createdBy" integer NOT NULL, "lastUpdatedBy" integer, "id" SERIAL NOT NULL, "idPlayer" integer NOT NULL, CONSTRAINT "PK_3c759e446a41418e605c90f15a3" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "forum"."sub_category_moderator" ("creationDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP DEFAULT now(), "createdBy" integer NOT NULL, "lastUpdatedBy" integer, "id" SERIAL NOT NULL, "idModerator" integer NOT NULL, "idSubCategory" integer NOT NULL, CONSTRAINT "PK_2928097c70455a9ea560a43aedd" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "forum"."post" ("creationDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP DEFAULT now(), "createdBy" integer NOT NULL, "lastUpdatedBy" integer, "id" SERIAL NOT NULL, "post" character varying(10000) NOT NULL, "idTopic" integer NOT NULL, "idPlayer" integer NOT NULL, "deletedDate" TIMESTAMP, CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "forum"."topic_player_last_read" ("creationDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP DEFAULT now(), "createdBy" integer NOT NULL, "lastUpdatedBy" integer, "id" SERIAL NOT NULL, "idPlayer" integer NOT NULL, "idTopic" integer NOT NULL, "readDate" TIMESTAMP NOT NULL, CONSTRAINT "PK_5907829781063adcecb1af0aaa7" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "forum"."topic" ("creationDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP DEFAULT now(), "createdBy" integer NOT NULL, "lastUpdatedBy" integer, "id" SERIAL NOT NULL, "name" character varying(150) NOT NULL, "idSubCategory" integer NOT NULL, "idScore" integer, "views" integer NOT NULL, "pinned" boolean NOT NULL DEFAULT false, "lockedDate" TIMESTAMP, CONSTRAINT "PK_33aa4ecb4e4f20aa0157ea7ef61" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "forum"."sub_category" ("creationDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP DEFAULT now(), "createdBy" integer NOT NULL, "lastUpdatedBy" integer, "id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "description" character varying(1000) NOT NULL, "idCategory" integer NOT NULL, CONSTRAINT "PK_59f4461923255f1ce7fc5e7423c" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "forum"."category" ("creationDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP DEFAULT now(), "createdBy" integer NOT NULL, "lastUpdatedBy" integer, "id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "forum"."topic_transfer" ("creationDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP DEFAULT now(), "createdBy" integer NOT NULL, "lastUpdatedBy" integer, "id" SERIAL NOT NULL, "idTopic" integer NOT NULL, "idSubCategoryFrom" integer NOT NULL, "idSubCategoryTo" integer NOT NULL, CONSTRAINT "PK_08ca654fa6c06e5e4eee8594ce5" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`CREATE TYPE "main"."rule_type_enum" AS ENUM('Main', 'Forum')`);
    await queryRunner.query(`ALTER TABLE "main"."rule" ADD "type" "main"."rule_type_enum" NOT NULL DEFAULT 'Main'`);
    await queryRunner.query(
      `ALTER TABLE "forum"."moderator" ADD CONSTRAINT "FK_52f2ae25814fe2dd38d194b0840" FOREIGN KEY ("idPlayer") REFERENCES "main"."player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "forum"."sub_category_moderator" ADD CONSTRAINT "FK_fc47a1bdecac9fd1c61ba7f18ce" FOREIGN KEY ("idModerator") REFERENCES "forum"."moderator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "forum"."sub_category_moderator" ADD CONSTRAINT "FK_25191ee8a445c4192498b3da77e" FOREIGN KEY ("idSubCategory") REFERENCES "forum"."sub_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "forum"."post" ADD CONSTRAINT "FK_eb2f9d4b4bb951942b79c235a97" FOREIGN KEY ("idTopic") REFERENCES "forum"."topic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "forum"."post" ADD CONSTRAINT "FK_ac2dabb76d2761c9481dfd99ab2" FOREIGN KEY ("idPlayer") REFERENCES "main"."player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "forum"."topic_player_last_read" ADD CONSTRAINT "FK_a0f975ca10b2980272df66ee0bd" FOREIGN KEY ("idPlayer") REFERENCES "main"."player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "forum"."topic_player_last_read" ADD CONSTRAINT "FK_6061c3bcc9de747da9296f4d54c" FOREIGN KEY ("idTopic") REFERENCES "forum"."topic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "forum"."topic" ADD CONSTRAINT "FK_4632d144b285a96786d13b94685" FOREIGN KEY ("idSubCategory") REFERENCES "forum"."sub_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "forum"."topic" ADD CONSTRAINT "FK_e76121f21d765186444514c432e" FOREIGN KEY ("idScore") REFERENCES "main"."score"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "forum"."sub_category" ADD CONSTRAINT "FK_3b02a87ea001d503813633cdb8d" FOREIGN KEY ("idCategory") REFERENCES "forum"."category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "forum"."topic_transfer" ADD CONSTRAINT "FK_877569ff5714c05318c37b1ce66" FOREIGN KEY ("idTopic") REFERENCES "forum"."topic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "forum"."topic_transfer" ADD CONSTRAINT "FK_5a06769a70851ec4e16c112856a" FOREIGN KEY ("idSubCategoryFrom") REFERENCES "forum"."sub_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "forum"."topic_transfer" ADD CONSTRAINT "FK_044ed180f400514632147f9ed55" FOREIGN KEY ("idSubCategoryTo") REFERENCES "forum"."sub_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "forum"."topic_transfer" DROP CONSTRAINT "FK_044ed180f400514632147f9ed55"`);
    await queryRunner.query(`ALTER TABLE "forum"."topic_transfer" DROP CONSTRAINT "FK_5a06769a70851ec4e16c112856a"`);
    await queryRunner.query(`ALTER TABLE "forum"."topic_transfer" DROP CONSTRAINT "FK_877569ff5714c05318c37b1ce66"`);
    await queryRunner.query(`ALTER TABLE "forum"."sub_category" DROP CONSTRAINT "FK_3b02a87ea001d503813633cdb8d"`);
    await queryRunner.query(`ALTER TABLE "forum"."topic" DROP CONSTRAINT "FK_e76121f21d765186444514c432e"`);
    await queryRunner.query(`ALTER TABLE "forum"."topic" DROP CONSTRAINT "FK_4632d144b285a96786d13b94685"`);
    await queryRunner.query(
      `ALTER TABLE "forum"."topic_player_last_read" DROP CONSTRAINT "FK_6061c3bcc9de747da9296f4d54c"`
    );
    await queryRunner.query(
      `ALTER TABLE "forum"."topic_player_last_read" DROP CONSTRAINT "FK_a0f975ca10b2980272df66ee0bd"`
    );
    await queryRunner.query(`ALTER TABLE "forum"."post" DROP CONSTRAINT "FK_ac2dabb76d2761c9481dfd99ab2"`);
    await queryRunner.query(`ALTER TABLE "forum"."post" DROP CONSTRAINT "FK_eb2f9d4b4bb951942b79c235a97"`);
    await queryRunner.query(
      `ALTER TABLE "forum"."sub_category_moderator" DROP CONSTRAINT "FK_25191ee8a445c4192498b3da77e"`
    );
    await queryRunner.query(
      `ALTER TABLE "forum"."sub_category_moderator" DROP CONSTRAINT "FK_fc47a1bdecac9fd1c61ba7f18ce"`
    );
    await queryRunner.query(`ALTER TABLE "forum"."moderator" DROP CONSTRAINT "FK_52f2ae25814fe2dd38d194b0840"`);
    await queryRunner.query(`ALTER TABLE "main"."rule" DROP COLUMN "type"`);
    await queryRunner.query(`DROP TYPE "main"."rule_type_enum"`);
    await queryRunner.query(`DROP TABLE "forum"."topic_transfer"`);
    await queryRunner.query(`DROP TABLE "forum"."category"`);
    await queryRunner.query(`DROP TABLE "forum"."sub_category"`);
    await queryRunner.query(`DROP TABLE "forum"."topic"`);
    await queryRunner.query(`DROP TABLE "forum"."topic_player_last_read"`);
    await queryRunner.query(`DROP TABLE "forum"."post"`);
    await queryRunner.query(`DROP TABLE "forum"."sub_category_moderator"`);
    await queryRunner.query(`DROP TABLE "forum"."moderator"`);
  }
};
