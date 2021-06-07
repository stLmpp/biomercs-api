const { QueryRunner } = require('typeorm');

module.exports = class residentEvilVillage1621957255792 {
  newPlatforms = [
    { name: 'Playstation 5', shortName: 'PS5' },
    { name: 'Xbox Series X/S', shortName: 'XSX' },
  ];

  newGame = { name: 'Resident Evil Village', shortName: 'RE8' };

  newStages = [
    { name: 'The Village', shortName: 'VL' },
    { name: 'The Castle', shortName: 'CT' },
    { name: 'The Factory', shortName: 'FC' },
    { name: 'The Mad Village', shortName: 'MV' },
    { name: 'The Village II', shortName: 'VL2' },
    { name: 'The Castle II', shortName: 'CT2' },
    { name: 'The Factory II', shortName: 'FC2' },
    { name: 'The Mad Village II', shortName: 'MV2' },
  ];

  newCharacter = { name: 'Ethan', shortName: 'Ethan', costume: 'Default' };

  platforms = ['Computer', 'Playstation 4', 'Xbox One', ...this.newPlatforms.map(platform => platform.name)];
  miniGame = 'The Mercenaries';
  mode = 'Solo';

  /**
   * @param { QueryRunner } queryRunner
   * @returns {Promise<void>}
   */
  async up(queryRunner) {
    const platformInsert =
      'insert into "platform" ("createdBy", "lastUpdatedBy", name, "shortName") VALUES ' +
      this.newPlatforms.map(item => `(-1, -1, '${item.name}', '${item.shortName}')`).join(',');
    await queryRunner.query(platformInsert);
    const inPlatforms = this.platforms.map(platform => `'${platform}'`);

    const idPlatforms = await queryRunner
      .query(`select id from "platform" where name in (${inPlatforms.join(',')})`)
      .then(this.mapId(true));

    const idGame = await queryRunner
      .query(
        `insert into "game" ("createdBy", "lastUpdatedBy", name, "shortName") VALUES (-1, -1, '${this.newGame.name}', '${this.newGame.shortName}') returning id`
      )
      .then(this.mapId());

    const stageInsertValues =
      'insert into "stage" ("createdBy", "lastUpdatedBy", name, "shortName") VALUES ' +
      this.newStages.map(stage => `(-1, -1, '${stage.name}', '${stage.shortName}')`).join(',') +
      ' returning id';
    const idStages = await queryRunner.query(stageInsertValues).then(this.mapId(true));

    const idCharacter = await queryRunner
      .query(
        `insert into "character" ("createdBy", "lastUpdatedBy", name) VALUES (-1, -1, '${this.newCharacter.name}') returning id`
      )
      .then(this.mapId());
    const idCharacterCostume = await queryRunner
      .query(
        `insert into "character_costume" ("createdBy", "lastUpdatedBy", "idCharacter", name, "shortName") VALUES (-1, -1, ${idCharacter}, '${this.newCharacter.costume}', '${this.newCharacter.shortName}') returning id`
      )
      .then(this.mapId());

    const idMiniGame = await queryRunner
      .query(`select id from "mini_game" where name = '${this.miniGame}'`)
      .then(this.mapId());
    const idMode = await queryRunner.query(`select id from "mode" where name = '${this.mode}'`).then(this.mapId());

    const insertGameMiniGame = `insert into "game_mini_game" ("createdBy", "lastUpdatedBy", "idGame", "idMiniGame") VALUES (-1, -1, ${idGame}, ${idMiniGame}) returning id`;
    const idGameMiniGame = await queryRunner.query(insertGameMiniGame).then(this.mapId());

    const insertPlatformGameMiniGame =
      `insert into "platform_game_mini_game" ("createdBy", "lastUpdatedBy", "idPlatform", "idGameMiniGame") VALUES ` +
      idPlatforms.map(idPlatform => `(-1, -1, ${idPlatform}, ${idGameMiniGame})`).join(',') +
      ' returning id';
    const idPlatformGameMiniGames = await queryRunner.query(insertPlatformGameMiniGame).then(this.mapId(true));

    const insertPlatformGameMiniGameMode =
      `insert into "platform_game_mini_game_mode" ("createdBy", "lastUpdatedBy", "idMode", "idPlatformGameMiniGame") VALUES ` +
      idPlatformGameMiniGames
        .map(idPlatformGameMiniGame => `(-1, -1, ${idMode}, ${idPlatformGameMiniGame})`)
        .join(',') +
      ' returning id';
    const idPlatformGameMiniGameModes = await queryRunner.query(insertPlatformGameMiniGameMode).then(this.mapId(true));

    const insertPlatformGameMiniGameModeCharacterCostume =
      `insert into "platform_game_mini_game_mode_character_costume" ("createdBy", "lastUpdatedBy", "idCharacterCostume", "idPlatformGameMiniGameMode") VALUES ` +
      idPlatformGameMiniGameModes.map(
        idPlatformGameMiniGameMode => `(-1, -1, ${idCharacterCostume}, ${idPlatformGameMiniGameMode})`
      );
    await queryRunner.query(insertPlatformGameMiniGameModeCharacterCostume);

    let insertPlatformGameMiniGameModeStage = `insert into "platform_game_mini_game_mode_stage" ("createdBy", "lastUpdatedBy", "idStage", "idPlatformGameMiniGameMode") VALUES `;
    for (const idPlatformGameMiniGameMode of idPlatformGameMiniGameModes) {
      for (const idStage of idStages) {
        insertPlatformGameMiniGameModeStage += `(-1, -1, ${idStage}, ${idPlatformGameMiniGameMode}),`;
      }
    }
    insertPlatformGameMiniGameModeStage = insertPlatformGameMiniGameModeStage.slice(0, -1);
    await queryRunner.query(insertPlatformGameMiniGameModeStage);
  }

  /**
   * @param { QueryRunner } queryRunner
   * @param { string } query
   * @returns {Promise<void>}
   */
  async returningId(queryRunner, query) {
    return queryRunner.query(query).then(([result]) => result.id);
  }

  /**
   * @param { QueryRunner } queryRunner
   * @returns {Promise<void>}
   */
  async down(queryRunner) {
    const inPlatforms = this.platforms.map(platform => `'${platform}'`);
    const idPlatforms = await queryRunner
      .query(`select id from "platform" where name in (${inPlatforms.join(',')})`)
      .then(this.mapId(true));
    const idGame = await queryRunner
      .query(`select id from "game" where name = '${this.newGame.name}'`)
      .then(this.mapId());
    const idMiniGame = await queryRunner
      .query(`select id from "mini_game" where name = '${this.miniGame}'`)
      .then(this.mapId());
    const idMode = await queryRunner.query(`select id from "mode" where name = '${this.mode}'`).then(this.mapId());
    const inStages = this.newStages.map(stage => `'${stage.name}'`).join(',');
    const idStages = await queryRunner
      .query(`select id from "stage" where name in (${inStages})`)
      .then(this.mapId(true));
    const idCharacter = await queryRunner.query(`select id from "character" where name = '${this.newCharacter.name}'`);
    const idCharacterCostume = await queryRunner
      .query(`select id from "character_costume" where "idCharacter" = ${idCharacter}`)
      .then(this.mapId());
    const idGameMiniGame = await queryRunner
      .query(`select id from "game_mini_game" where "idGame" = ${idGame} and "idMiniGame" = ${idMiniGame}`)
      .then(this.mapId());
    const idPlatformGameMiniGames = await queryRunner
      .query(
        `select id from "platform_game_mini_game" where "idPlatform" in (${idPlatforms.join(
          ','
        )}) and "idGameMiniGame" = ${idGameMiniGame}`
      )
      .then(this.mapId(true));
    const idPlatformGameMiniGameModes = await queryRunner
      .query(
        `select id from "platform_game_mini_game_mode" where "idPlatformGameMiniGame" in (${idPlatformGameMiniGames.join(
          ','
        )}) and "idMode" = ${idMode}`
      )
      .then(this.mapId(true));
    const idPlatformGameMiniGameModeStages = await queryRunner
      .query(
        `select id from "platform_game_mini_game_mode_stage" where "idPlatformGameMiniGameMode" in (${idPlatformGameMiniGameModes.join(
          ','
        )}) and "idStage" in (${idStages.join(',')})`
      )
      .then(this.mapId(true));
    const idPlatformGameMiniGameModeCharacterCostumes = await queryRunner.query(
      `select id from "platform_game_mini_game_mode_character_costume" where "idPlatformGameMiniGameMode" in (${idPlatformGameMiniGameModes.join(
        ','
      )}) and "idCharacterCostume" = ${idCharacterCostume}`
    );
    await queryRunner.query(
      `delete from "platform_game_mini_game_mode_character_costume" where id in (${idPlatformGameMiniGameModeCharacterCostumes.join(
        ','
      )})`
    );
    await queryRunner.query(
      `delete from "platform_game_mini_game_mode_stage" where id in (${idPlatformGameMiniGameModeStages.join(',')})`
    );
    await queryRunner.query(
      `delete from "platform_game_mini_game_mode" where id in (${idPlatformGameMiniGameModes.join(',')})`
    );
    await queryRunner.query(`delete from "platform_game_mini_game" where id in (${idPlatformGameMiniGames.join(',')})`);
    await queryRunner.query(`delete from "game_mini_game" where id = ${idGameMiniGame}`);
    await queryRunner.query(`delete from "character_costume" where id = ${idCharacterCostume}`);
    await queryRunner.query(`delete from "character" where id = ${idCharacter}`);
    await queryRunner.query(`delete from "stage" where id in (${idStages.join(',')})`);
    await queryRunner.query(`delete from "game" where id = ${idGame}`);
    await queryRunner.query(`delete from "platform" where id in (${idPlatforms.join(',')})`);
  }

  mapId(array = false) {
    return results => (array ? results.map(r => r.id) : results[0].id);
  }
};
