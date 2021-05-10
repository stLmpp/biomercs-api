const { QueryRunner } = require('typeorm');

module.exports = class initialData1620482743920 {
  /**
   * @param { QueryRunner } queryRunner
   * @returns {Promise<void>}
   */
  async up(queryRunner) {
    const regions = require('./insert/region');
    await queryRunner.query(...regions);
    await queryRunner.query(require('./insert/all'));
  }

  /**
   * @param { QueryRunner } queryRunner
   * @returns {Promise<void>}
   */
  async down(queryRunner) {
    await queryRunner.query(`delete from "region";`);
    await queryRunner.query(`delete from "platform_game_mini_game_mode_character_costume";`);
    await queryRunner.query(`delete from "platform_game_mini_game_mode_stage";`);
    await queryRunner.query(`delete from "platform_game_mini_game_mode";`);
    await queryRunner.query(`delete from "platform_game_mini_game";`);
    await queryRunner.query(`delete from "platform";`);
    await queryRunner.query(`delete from "game_mini_game";`);
    await queryRunner.query(`delete from "game";`);
    await queryRunner.query(`delete from "mini_game";`);
    await queryRunner.query(`delete from "mode";`);
    await queryRunner.query(`delete from "character_costume";`);
    await queryRunner.query(`delete from "character";`);
  }
};
