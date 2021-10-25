const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class topicPlayerLastReadUniqueIndex1631564272060 {
  name = 'topicPlayerLastReadUniqueIndex1631564272060';

  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "forum"."topic_player_last_read" ADD CONSTRAINT "UQ_c53441ad20e3f730c326b985506" UNIQUE ("idPlayer", "idTopic")`
    );
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "forum"."topic_player_last_read" DROP CONSTRAINT "UQ_c53441ad20e3f730c326b985506"`
    );
  }
};
