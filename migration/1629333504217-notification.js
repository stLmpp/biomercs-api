const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class notification1629333504217 {
  name = 'notification1629333504217';

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE "main"."notification_type" ("creationDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP DEFAULT now(), "createdBy" integer NOT NULL, "lastUpdatedBy" integer, "id" SERIAL NOT NULL, "content" text NOT NULL, CONSTRAINT "PK_3e0e1fa68c25d84f808ca11dbaa" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "main"."notification" ("creationDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP DEFAULT now(), "createdBy" integer NOT NULL, "lastUpdatedBy" integer, "id" SERIAL NOT NULL, "content" text NOT NULL, "idUser" integer NOT NULL, "read" boolean NOT NULL DEFAULT false, "idScore" integer, "idNotificationType" integer, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "main"."notification" ADD CONSTRAINT "FK_c760ca4f1364520c0b595270d1d" FOREIGN KEY ("idUser") REFERENCES "main"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "main"."notification" ADD CONSTRAINT "FK_517458a0ba74630576c66a9a3ad" FOREIGN KEY ("idScore") REFERENCES "main"."score"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "main"."notification" ADD CONSTRAINT "FK_f9f312692d1ccb4872f44721ae8" FOREIGN KEY ("idNotificationType") REFERENCES "main"."notification_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "main"."notification" DROP CONSTRAINT "FK_f9f312692d1ccb4872f44721ae8"`);
    await queryRunner.query(`ALTER TABLE "main"."notification" DROP CONSTRAINT "FK_517458a0ba74630576c66a9a3ad"`);
    await queryRunner.query(`ALTER TABLE "main"."notification" DROP CONSTRAINT "FK_c760ca4f1364520c0b595270d1d"`);
    await queryRunner.query(`DROP TABLE "main"."notification"`);
    await queryRunner.query(`DROP TABLE "main"."notification_type"`);
  }
};
