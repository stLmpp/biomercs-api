const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class postHistory1634946092179 {
    name = 'postHistory1634946092179'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "forum"."post_history" ("creationDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP DEFAULT now(), "createdBy" integer NOT NULL, "lastUpdatedBy" integer, "id" SERIAL NOT NULL, "name" character varying(500) NOT NULL, "content" text NOT NULL, "idTopic" integer NOT NULL, "idPlayer" integer NOT NULL, "deletedDate" TIMESTAMP, "idPost" integer NOT NULL, CONSTRAINT "PK_6dd0832f4c2ac89b2ede9c4d2ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "forum"."post_history" ADD CONSTRAINT "FK_c5642c559bff90cd8c5cc940497" FOREIGN KEY ("idTopic") REFERENCES "forum"."topic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "forum"."post_history" ADD CONSTRAINT "FK_22dc1babff9ae363412f11db2b7" FOREIGN KEY ("idPlayer") REFERENCES "main"."player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "forum"."post_history" ADD CONSTRAINT "FK_ab36e97ff0f24e76930ddbbcd3e" FOREIGN KEY ("idPost") REFERENCES "forum"."post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "forum"."post_history" DROP CONSTRAINT "FK_ab36e97ff0f24e76930ddbbcd3e"`);
        await queryRunner.query(`ALTER TABLE "forum"."post_history" DROP CONSTRAINT "FK_22dc1babff9ae363412f11db2b7"`);
        await queryRunner.query(`ALTER TABLE "forum"."post_history" DROP CONSTRAINT "FK_c5642c559bff90cd8c5cc940497"`);
        await queryRunner.query(`DROP TABLE "forum"."post_history"`);
    }
}
