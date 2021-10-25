const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class forumTopicPlayer1629903676585 {
  name = 'forumTopicPlayer1629903676585';

  async up(queryRunner) {
    await queryRunner.query(`ALTER TABLE "forum"."topic" ADD "idPlayer" integer NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "forum"."topic" ADD CONSTRAINT "FK_cc3a1a532a408520b0677f80675" FOREIGN KEY ("idPlayer") REFERENCES "main"."player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "forum"."topic" DROP CONSTRAINT "FK_cc3a1a532a408520b0677f80675"`);
    await queryRunner.query(`ALTER TABLE "forum"."topic" DROP COLUMN "idPlayer"`);
  }
};
