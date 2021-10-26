const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class topicPlayerSettingsNotifications1635280204061 {
    name = 'topicPlayerSettingsNotifications1635280204061'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "forum"."topic_player_settings" ("creationDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP DEFAULT now(), "createdBy" integer NOT NULL, "lastUpdatedBy" integer, "id" SERIAL NOT NULL, "idTopic" integer NOT NULL, "idPlayer" integer NOT NULL, "notifications" boolean NOT NULL, CONSTRAINT "PK_d402507c0d90dc0eab5d8624050" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "forum"."topic_player_settings" ADD CONSTRAINT "FK_9c9443082f18bc80a81ada20a14" FOREIGN KEY ("idTopic") REFERENCES "forum"."topic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "forum"."topic_player_settings" ADD CONSTRAINT "FK_50dd7b1419a733e8c352a80e0d5" FOREIGN KEY ("idPlayer") REFERENCES "main"."player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "forum"."topic_player_settings" DROP CONSTRAINT "FK_50dd7b1419a733e8c352a80e0d5"`);
        await queryRunner.query(`ALTER TABLE "forum"."topic_player_settings" DROP CONSTRAINT "FK_9c9443082f18bc80a81ada20a14"`);
        await queryRunner.query(`DROP TABLE "forum"."topic_player_settings"`);
    }
}
