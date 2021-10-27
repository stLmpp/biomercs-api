const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class topicPlayerSettingsUniqueIndex1635282562949 {
  name = 'topicPlayerSettingsUniqueIndex1635282562949';

  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "forum"."topic_player_settings" ADD CONSTRAINT "UQ_a329bf9223102b752c148397d54" UNIQUE ("idTopic", "idPlayer")`
    );
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "forum"."topic_player_settings" DROP CONSTRAINT "UQ_a329bf9223102b752c148397d54"`
    );
  }
};
