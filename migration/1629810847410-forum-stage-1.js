const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class forumStage11629810847410 {
  name = 'forumStage11629810847410';

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE "forum"."sub_category_transfer" ("creationDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP DEFAULT now(), "createdBy" integer NOT NULL, "lastUpdatedBy" integer, "id" SERIAL NOT NULL, "idSubCategory" integer NOT NULL, "idCategoryFrom" integer NOT NULL, "idCategoryTo" integer NOT NULL, CONSTRAINT "PK_08bfc9d7381be0d2e3faf41cdf6" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`ALTER TABLE "forum"."sub_category" ADD "deletedDate" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "forum"."category" ADD "deletedDate" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "forum"."moderator" DROP CONSTRAINT "FK_52f2ae25814fe2dd38d194b0840"`);
    await queryRunner.query(
      `ALTER TABLE "forum"."moderator" ADD CONSTRAINT "UQ_af372a707de12083cc4c4297655" UNIQUE ("idPlayer")`
    );
    await queryRunner.query(`ALTER TABLE "main"."rule" ALTER COLUMN "type" SET DEFAULT 'Main'`);
    await queryRunner.query(
      `ALTER TABLE "forum"."sub_category_moderator" ADD CONSTRAINT "UQ_20634809b6b4747a488dd677f9b" UNIQUE ("idModerator", "idSubCategory")`
    );
    await queryRunner.query(
      `ALTER TABLE "forum"."moderator" ADD CONSTRAINT "FK_52f2ae25814fe2dd38d194b0840" FOREIGN KEY ("idPlayer") REFERENCES "main"."player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "forum"."sub_category_transfer" ADD CONSTRAINT "FK_34e1c0842888946b8f2fd00a745" FOREIGN KEY ("idSubCategory") REFERENCES "forum"."sub_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "forum"."sub_category_transfer" ADD CONSTRAINT "FK_529bc2324edf10db6f3a3d45350" FOREIGN KEY ("idCategoryFrom") REFERENCES "forum"."category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "forum"."sub_category_transfer" ADD CONSTRAINT "FK_9363f8c172683445945632e3e99" FOREIGN KEY ("idCategoryTo") REFERENCES "forum"."category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "forum"."sub_category_transfer" DROP CONSTRAINT "FK_9363f8c172683445945632e3e99"`
    );
    await queryRunner.query(
      `ALTER TABLE "forum"."sub_category_transfer" DROP CONSTRAINT "FK_529bc2324edf10db6f3a3d45350"`
    );
    await queryRunner.query(
      `ALTER TABLE "forum"."sub_category_transfer" DROP CONSTRAINT "FK_34e1c0842888946b8f2fd00a745"`
    );
    await queryRunner.query(`ALTER TABLE "forum"."moderator" DROP CONSTRAINT "FK_52f2ae25814fe2dd38d194b0840"`);
    await queryRunner.query(
      `ALTER TABLE "forum"."sub_category_moderator" DROP CONSTRAINT "UQ_20634809b6b4747a488dd677f9b"`
    );
    await queryRunner.query(`ALTER TABLE "main"."rule" ALTER COLUMN "type" SET DEFAULT 'Main'.rule_type_enum`);
    await queryRunner.query(`ALTER TABLE "forum"."moderator" DROP CONSTRAINT "UQ_af372a707de12083cc4c4297655"`);
    await queryRunner.query(
      `ALTER TABLE "forum"."moderator" ADD CONSTRAINT "FK_52f2ae25814fe2dd38d194b0840" FOREIGN KEY ("idPlayer") REFERENCES "main"."player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(`ALTER TABLE "forum"."category" DROP COLUMN "deletedDate"`);
    await queryRunner.query(`ALTER TABLE "forum"."sub_category" DROP COLUMN "deletedDate"`);
    await queryRunner.query(`DROP TABLE "forum"."sub_category_transfer"`);
  }
};
