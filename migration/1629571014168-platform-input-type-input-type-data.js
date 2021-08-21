const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class platformInputTypeInputTypeData1629571014168 {
  /**
   * @param { QueryRunner } queryRunner
   * @returns {Promise<void>}
   */
  async up(queryRunner) {
    await queryRunner.query(`
      insert into main.input_type ("createdBy", "lastUpdatedBy", name) values
       (-1, -1, 'Mouse/Keyboard'),
       (-1, -1, 'DualShock 3'),
       (-1, -1, 'DualShock 4'),
       (-1, -1, 'DualSense'),
       (-1, -1, 'Xbox 360 Controller'),
       (-1, -1, 'Xbox One/Series Controller')
    `);
    await queryRunner.query(`
      insert into main.platform_input_type ("createdBy", "lastUpdatedBy", "idInputType", "idPlatform")
       select -1, -1, id, (select id from main.platform where "shortName" = 'PC') from main.input_type
      `);
    await queryRunner.query(`
      insert into main.platform_input_type ("createdBy", "lastUpdatedBy", "idInputType", "idPlatform") values
      (-1, -1, (select id from main.input_type where name = 'DualShock 3'), (select id from main.platform where "shortName" = 'PS3'))
    `);
    await queryRunner.query(`
      insert into main.platform_input_type ("createdBy", "lastUpdatedBy", "idInputType", "idPlatform") values
      (-1, -1, (select id from main.input_type where name = 'DualShock 4'), (select id from main.platform where "shortName" = 'PS4'))
    `);
    await queryRunner.query(`
      insert into main.platform_input_type ("createdBy", "lastUpdatedBy", "idInputType", "idPlatform") values
      (-1, -1, (select id from main.input_type where name = 'Xbox 360 Controller'), (select id from main.platform where "shortName" = 'X360'))
    `);
    await queryRunner.query(`
      insert into main.platform_input_type ("createdBy", "lastUpdatedBy", "idInputType", "idPlatform") values
      (-1, -1, (select id from main.input_type where name = 'Xbox One/Series Controller'), (select id from main.platform where "shortName" = 'X1'))
    `);
    await queryRunner.query(`
      insert into main.platform_input_type ("createdBy", "lastUpdatedBy", "idInputType", "idPlatform") values
      (-1, -1, (select id from main.input_type where name = 'DualSense'), (select id from main.platform where "shortName" = 'PS5'))
    `);
    await queryRunner.query(`
      insert into main.platform_input_type ("createdBy", "lastUpdatedBy", "idInputType", "idPlatform") values
      (-1, -1, (select id from main.input_type where name = 'Xbox One/Series Controller'), (select id from main.platform where "shortName" = 'XSX'))
    `);
  }

  /**
   * @param { QueryRunner } queryRunner
   * @returns {Promise<void>}
   */
  async down(queryRunner) {
    await queryRunner.query(`DELETE FROM main.platform_input_type`);
    await queryRunner.query(`DELETE FROM main.input_type`);
    await queryRunner.query(`alter sequence main.platform_input_type_id_seq restart with 1`);
    await queryRunner.query(`alter sequence main.input_type_id_seq restart with 1`);
  }
};
