const { MigrationInterface, QueryRunner } = require('typeorm');
const { SchemaEnum } = require('../dist/src/environment/schema.enum');

module.exports = class schemas1629118747810 {
  name = 'schemas1629118747810';

  /**
   * @param { QueryRunner } queryRunner
   * @returns {Promise<void>}
   */
  async up(queryRunner) {
    await queryRunner.createSchema(SchemaEnum.main);
    await queryRunner.createSchema(SchemaEnum.forum);
    await queryRunner.query(`ALTER TABLE "public"."steam_profile" SET SCHEMA ${SchemaEnum.main}`);
    await queryRunner.query(`ALTER TABLE "public"."region" SET SCHEMA ${SchemaEnum.main}`);
    await queryRunner.query(`ALTER TABLE "public"."auth_confirmation" SET SCHEMA ${SchemaEnum.main}`);
    await queryRunner.query(`ALTER TABLE "public"."game" SET SCHEMA ${SchemaEnum.main}`);
    await queryRunner.query(`ALTER TABLE "public"."game_mini_game" SET SCHEMA ${SchemaEnum.main}`);
    await queryRunner.query(`ALTER TABLE "public"."mini_game" SET SCHEMA ${SchemaEnum.main}`);
    await queryRunner.query(`ALTER TABLE "public"."platform" SET SCHEMA ${SchemaEnum.main}`);
    await queryRunner.query(`ALTER TABLE "public"."platform_game_mini_game" SET SCHEMA ${SchemaEnum.main}`);
    await queryRunner.query(`ALTER TABLE "public"."platform_game_mini_game_mode" SET SCHEMA ${SchemaEnum.main}`);
    await queryRunner.query(`ALTER TABLE "public"."platform_game_mini_game_mode_stage" SET SCHEMA ${SchemaEnum.main}`);
    await queryRunner.query(`ALTER TABLE "public"."stage" SET SCHEMA ${SchemaEnum.main}`);
    await queryRunner.query(`ALTER TABLE "public"."mode" SET SCHEMA ${SchemaEnum.main}`);
    await queryRunner.query(
      `ALTER TABLE "public"."platform_game_mini_game_mode_character_costume" SET SCHEMA ${SchemaEnum.main}`
    );
    await queryRunner.query(`ALTER TABLE "public"."character_costume" SET SCHEMA ${SchemaEnum.main}`);
    await queryRunner.query(`ALTER TABLE "public"."character" SET SCHEMA ${SchemaEnum.main}`);
    await queryRunner.query(`ALTER TABLE "public"."score_world_record" SET SCHEMA ${SchemaEnum.main}`);
    await queryRunner.query(`ALTER TABLE "public"."score_world_record_character" SET SCHEMA ${SchemaEnum.main}`);
    await queryRunner.query(`ALTER TABLE "public"."score_change_request" SET SCHEMA ${SchemaEnum.main}`);
    await queryRunner.query(`ALTER TABLE "public"."score_approval" SET SCHEMA ${SchemaEnum.main}`);
    await queryRunner.query(`ALTER TABLE "public"."score_approval_motive" SET SCHEMA ${SchemaEnum.main}`);
    await queryRunner.query(`ALTER TABLE "public"."score_status" SET SCHEMA ${SchemaEnum.main}`);
    await queryRunner.query(`ALTER TABLE "public"."player" SET SCHEMA ${SchemaEnum.main}`);
    await queryRunner.query(`ALTER TABLE "public"."rule" SET SCHEMA ${SchemaEnum.main}`);
    await queryRunner.query(`ALTER TABLE "public"."mail_queue" SET SCHEMA ${SchemaEnum.main}`);
    await queryRunner.query(`ALTER TABLE "public"."score_player" SET SCHEMA ${SchemaEnum.main}`);
    await queryRunner.query(`ALTER TABLE "public"."score" SET SCHEMA ${SchemaEnum.main}`);
    await queryRunner.query(`ALTER TABLE "public"."user" SET SCHEMA ${SchemaEnum.main}`);
    await queryRunner.query(`ALTER TABLE "public"."error" SET SCHEMA ${SchemaEnum.main}`);
    await queryRunner.query(`ALTER TABLE "public"."input_type" SET SCHEMA ${SchemaEnum.main}`);
    await queryRunner.query(`ALTER TYPE "public"."mail_queue_textencoding_enum" SET SCHEMA ${SchemaEnum.main}`);
    await queryRunner.query(`ALTER TYPE "public"."score_approval_action_enum" SET SCHEMA ${SchemaEnum.main}`);
    await queryRunner.query(`ALTER TYPE "public"."score_approval_motive_action_enum" SET SCHEMA ${SchemaEnum.main}`);
    await queryRunner.query(`ALTER TYPE "public"."score_world_record_type_enum" SET SCHEMA ${SchemaEnum.main}`);
  }

  /**
   * @param { QueryRunner } queryRunner
   * @returns {Promise<void>}
   */
  async down(queryRunner) {
    await queryRunner.dropSchema(SchemaEnum.main, true);
    await queryRunner.dropSchema(SchemaEnum.forum, true);
    await queryRunner.query(`ALTER TABLE "${SchemaEnum.main}"."steam_profile" SET SCHEMA public`);
    await queryRunner.query(`ALTER TABLE "${SchemaEnum.main}"."region" SET SCHEMA public`);
    await queryRunner.query(`ALTER TABLE "${SchemaEnum.main}"."auth_confirmation" SET SCHEMA public`);
    await queryRunner.query(`ALTER TABLE "${SchemaEnum.main}"."game" SET SCHEMA public`);
    await queryRunner.query(`ALTER TABLE "${SchemaEnum.main}"."game_mini_game" SET SCHEMA public`);
    await queryRunner.query(`ALTER TABLE "${SchemaEnum.main}"."mini_game" SET SCHEMA public`);
    await queryRunner.query(`ALTER TABLE "${SchemaEnum.main}"."platform" SET SCHEMA public`);
    await queryRunner.query(`ALTER TABLE "${SchemaEnum.main}"."platform_game_mini_game" SET SCHEMA public`);
    await queryRunner.query(`ALTER TABLE "${SchemaEnum.main}"."platform_game_mini_game_mode" SET SCHEMA public`);
    await queryRunner.query(`ALTER TABLE "${SchemaEnum.main}"."platform_game_mini_game_mode_stage" SET SCHEMA public`);
    await queryRunner.query(`ALTER TABLE "${SchemaEnum.main}"."stage" SET SCHEMA public`);
    await queryRunner.query(`ALTER TABLE "${SchemaEnum.main}"."mode" SET SCHEMA public`);
    await queryRunner.query(
      `ALTER TABLE "${SchemaEnum.main}"."platform_game_mini_game_mode_character_costume" SET SCHEMA public`
    );
    await queryRunner.query(`ALTER TABLE "${SchemaEnum.main}"."character_costume" SET SCHEMA public`);
    await queryRunner.query(`ALTER TABLE "${SchemaEnum.main}"."character" SET SCHEMA public`);
    await queryRunner.query(`ALTER TABLE "${SchemaEnum.main}"."score_world_record" SET SCHEMA public`);
    await queryRunner.query(`ALTER TABLE "${SchemaEnum.main}"."score_world_record_character" SET SCHEMA public`);
    await queryRunner.query(`ALTER TABLE "${SchemaEnum.main}"."score_change_request" SET SCHEMA public`);
    await queryRunner.query(`ALTER TABLE "${SchemaEnum.main}"."score_approval" SET SCHEMA public`);
    await queryRunner.query(`ALTER TABLE "${SchemaEnum.main}"."score_approval_motive" SET SCHEMA public`);
    await queryRunner.query(`ALTER TABLE "${SchemaEnum.main}"."score_status" SET SCHEMA public`);
    await queryRunner.query(`ALTER TABLE "${SchemaEnum.main}"."player" SET SCHEMA public`);
    await queryRunner.query(`ALTER TABLE "${SchemaEnum.main}"."rule" SET SCHEMA public`);
    await queryRunner.query(`ALTER TABLE "${SchemaEnum.main}"."mail_queue" SET SCHEMA public`);
    await queryRunner.query(`ALTER TABLE "${SchemaEnum.main}"."score_player" SET SCHEMA public`);
    await queryRunner.query(`ALTER TABLE "${SchemaEnum.main}"."score" SET SCHEMA public`);
    await queryRunner.query(`ALTER TABLE "${SchemaEnum.main}"."user" SET SCHEMA public`);
    await queryRunner.query(`ALTER TABLE "${SchemaEnum.main}"."error" SET SCHEMA public`);
    await queryRunner.query(`ALTER TABLE "${SchemaEnum.main}"."input_type" SET SCHEMA public`);
    await queryRunner.query(`ALTER TYPE "${SchemaEnum.main}"."mail_queue_textencoding_enum" SET SCHEMA public`);
    await queryRunner.query(`ALTER TYPE "${SchemaEnum.main}"."score_approval_action_enum" SET SCHEMA public`);
    await queryRunner.query(`ALTER TYPE "${SchemaEnum.main}"."score_approval_motive_action_enum" SET SCHEMA public"`);
    await queryRunner.query(`ALTER TYPE "${SchemaEnum.main}"."score_world_record_type_enum" SET SCHEMA public`);
  }
};
