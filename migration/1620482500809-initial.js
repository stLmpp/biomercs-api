const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class initial1620482500809 {
  name = 'initial1620482500809';

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE "steam_profile" ("id" SERIAL NOT NULL, "creationDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP DEFAULT now(), "createdBy" integer NOT NULL, "lastUpdatedBy" integer, "steamid" character varying NOT NULL, "communityvisibilitystate" integer NOT NULL, "profilestate" integer NOT NULL, "personaname" character varying NOT NULL, "profileurl" character varying NOT NULL, "avatar" character varying NOT NULL, "avatarmedium" character varying NOT NULL, "avatarfull" character varying NOT NULL, "avatarhash" character varying NOT NULL, "lastlogoff" integer, "personastate" integer NOT NULL, "realname" character varying, "primaryclanid" character varying, "timecreated" integer, "personastateflags" integer NOT NULL, "gameextrainfo" character varying, "loccountrycode" character varying, "gameid" character varying, CONSTRAINT "UQ_f139fad0e1610c0545b905a98cf" UNIQUE ("steamid"), CONSTRAINT "PK_bdd6986034016986efaf1d5e00d" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "region" ("id" SERIAL NOT NULL, "creationDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP DEFAULT now(), "createdBy" integer NOT NULL, "lastUpdatedBy" integer, "name" character varying NOT NULL, "shortName" character varying(10) NOT NULL, CONSTRAINT "PK_5f48ffc3af96bc486f5f3f3a6da" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "player" ("id" SERIAL NOT NULL, "creationDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP DEFAULT now(), "createdBy" integer NOT NULL, "lastUpdatedBy" integer, "personaName" character varying NOT NULL, "title" character varying, "aboutMe" character varying, "idUser" integer, "idSteamProfile" integer, "noUser" boolean NOT NULL DEFAULT false, "idRegion" integer NOT NULL, CONSTRAINT "UQ_2cc68df9fcd52298ba2d522dea9" UNIQUE ("personaName"), CONSTRAINT "REL_88caf770bdc2cc708e5930f12c" UNIQUE ("idUser"), CONSTRAINT "REL_d8e79b0d9f7f0698404bdce07e" UNIQUE ("idSteamProfile"), CONSTRAINT "PK_65edadc946a7faf4b638d5e8885" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "creationDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP DEFAULT now(), "createdBy" integer NOT NULL, "lastUpdatedBy" integer, "username" character varying NOT NULL, "password" character varying NOT NULL, "salt" character varying NOT NULL, "email" character varying NOT NULL, "lastOnline" TIMESTAMP, "rememberMe" boolean, "admin" boolean NOT NULL DEFAULT false, "idCurrentAuthConfirmation" integer, "dateFormat" character varying NOT NULL DEFAULT 'dd/MM/yyyy', CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "REL_d853a9355d891f6ddbcf9889f3" UNIQUE ("idCurrentAuthConfirmation"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "auth_confirmation" ("id" SERIAL NOT NULL, "creationDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP DEFAULT now(), "createdBy" integer NOT NULL, "lastUpdatedBy" integer, "code" integer NOT NULL, "expirationDate" TIMESTAMP NOT NULL, "confirmationDate" TIMESTAMP, "idUser" integer NOT NULL, CONSTRAINT "PK_64382720d34fc83b03e198f3049" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "character" ("id" SERIAL NOT NULL, "creationDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP DEFAULT now(), "createdBy" integer NOT NULL, "lastUpdatedBy" integer, "name" character varying NOT NULL, CONSTRAINT "PK_6c4aec48c564968be15078b8ae5" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_d80158dde1461b74ed8499e7d8" ON "character" ("name") `);
    await queryRunner.query(
      `CREATE TABLE "platform" ("id" SERIAL NOT NULL, "creationDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP DEFAULT now(), "createdBy" integer NOT NULL, "lastUpdatedBy" integer, "name" character varying NOT NULL, "shortName" character varying(10) NOT NULL, CONSTRAINT "PK_c33d6abeebd214bd2850bfd6b8e" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_b9b57ec16b9c2ac927aa62b8b3" ON "platform" ("name") `);
    await queryRunner.query(`CREATE INDEX "IDX_bb9295defd618944c5a554466f" ON "platform" ("shortName") `);
    await queryRunner.query(
      `CREATE TABLE "game" ("id" SERIAL NOT NULL, "creationDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP DEFAULT now(), "createdBy" integer NOT NULL, "lastUpdatedBy" integer, "name" character varying NOT NULL, "shortName" character varying(10) NOT NULL, CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_5d1e08e04b97aa06d671cd5840" ON "game" ("name") `);
    await queryRunner.query(`CREATE INDEX "IDX_9cf39b223f4b2b4eb21978863d" ON "game" ("shortName") `);
    await queryRunner.query(
      `CREATE TABLE "mini_game" ("id" SERIAL NOT NULL, "creationDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP DEFAULT now(), "createdBy" integer NOT NULL, "lastUpdatedBy" integer, "name" character varying NOT NULL, CONSTRAINT "PK_85c6da5ff6993956153cf04b10a" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_dcead769fe71a7e8905c89fdf5" ON "mini_game" ("name") `);
    await queryRunner.query(
      `CREATE TABLE "game_mini_game" ("id" SERIAL NOT NULL, "creationDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP DEFAULT now(), "createdBy" integer NOT NULL, "lastUpdatedBy" integer, "idGame" integer NOT NULL, "idMiniGame" integer NOT NULL, CONSTRAINT "UQ_f15c4cf3f2a631df6309458a88f" UNIQUE ("idGame", "idMiniGame"), CONSTRAINT "PK_e03497ec8216b6db2412a7f22f2" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "platform_game_mini_game" ("id" SERIAL NOT NULL, "creationDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP DEFAULT now(), "createdBy" integer NOT NULL, "lastUpdatedBy" integer, "idPlatform" integer NOT NULL, "idGameMiniGame" integer NOT NULL, CONSTRAINT "UQ_be52f427500263b7a8cf7f5a110" UNIQUE ("idPlatform", "idGameMiniGame"), CONSTRAINT "PK_a9f40bbd393602e6d928b7784ba" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "mode" ("id" SERIAL NOT NULL, "creationDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP DEFAULT now(), "createdBy" integer NOT NULL, "lastUpdatedBy" integer, "name" character varying NOT NULL, "playerQuantity" integer NOT NULL, CONSTRAINT "PK_ca852cfca8f2fe91ee9daa47ec6" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_6b2cb7f89d46fd760279936e30" ON "mode" ("name") `);
    await queryRunner.query(
      `CREATE TABLE "stage" ("id" SERIAL NOT NULL, "creationDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP DEFAULT now(), "createdBy" integer NOT NULL, "lastUpdatedBy" integer, "name" character varying NOT NULL, "shortName" character varying(10) NOT NULL, CONSTRAINT "PK_c54d11b3c24a188262844af1612" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_cbeb0a0f411c8b0879565811d0" ON "stage" ("name") `);
    await queryRunner.query(`CREATE INDEX "IDX_10441b2716f7fc77c6bded3d0d" ON "stage" ("shortName") `);
    await queryRunner.query(
      `CREATE TABLE "platform_game_mini_game_mode_stage" ("id" SERIAL NOT NULL, "creationDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP DEFAULT now(), "createdBy" integer NOT NULL, "lastUpdatedBy" integer, "idPlatformGameMiniGameMode" integer NOT NULL, "idStage" integer NOT NULL, CONSTRAINT "UQ_2bf93d373b38cbfa97e77a03649" UNIQUE ("idPlatformGameMiniGameMode", "idStage"), CONSTRAINT "PK_b947f7cf85b8e39e6d157115120" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "platform_game_mini_game_mode" ("id" SERIAL NOT NULL, "creationDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP DEFAULT now(), "createdBy" integer NOT NULL, "lastUpdatedBy" integer, "idPlatformGameMiniGame" integer NOT NULL, "idMode" integer NOT NULL, CONSTRAINT "UQ_e9c568eb40fecdd0730036374c4" UNIQUE ("idPlatformGameMiniGame", "idMode"), CONSTRAINT "PK_342d6cfeadc4a3c01a109542761" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "platform_game_mini_game_mode_character_costume" ("id" SERIAL NOT NULL, "creationDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP DEFAULT now(), "createdBy" integer NOT NULL, "lastUpdatedBy" integer, "idPlatformGameMiniGameMode" integer NOT NULL, "idCharacterCostume" integer NOT NULL, CONSTRAINT "UQ_45f02464425b677ec32953d6aef" UNIQUE ("idPlatformGameMiniGameMode", "idCharacterCostume"), CONSTRAINT "PK_e13dcaa1f031b0564faf7070607" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "character_costume" ("id" SERIAL NOT NULL, "creationDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP DEFAULT now(), "createdBy" integer NOT NULL, "lastUpdatedBy" integer, "idCharacter" integer NOT NULL, "name" character varying NOT NULL, "shortName" character varying(15) NOT NULL, CONSTRAINT "PK_79c2276007f63d29c2e16ee1cbb" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_80071a3e68f6f585127b9dc73c" ON "character_costume" ("name") `);
    await queryRunner.query(`CREATE INDEX "IDX_00bb7c711ff4189090801224e4" ON "character_costume" ("shortName") `);
    await queryRunner.query(`CREATE TYPE "score_approval_motive_action_enum" AS ENUM('Approve', 'Reject')`);
    await queryRunner.query(
      `CREATE TABLE "score_approval_motive" ("id" SERIAL NOT NULL, "creationDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP DEFAULT now(), "createdBy" integer NOT NULL, "lastUpdatedBy" integer, "description" character varying NOT NULL, "action" "score_approval_motive_action_enum" NOT NULL, CONSTRAINT "PK_96c552f173fcf22f32e4528f4b0" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "score_player" ("id" SERIAL NOT NULL, "creationDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP DEFAULT now(), "createdBy" integer NOT NULL, "lastUpdatedBy" integer, "idScore" integer NOT NULL, "idPlayer" integer NOT NULL, "idPlatformGameMiniGameModeCharacterCostume" integer NOT NULL, "host" boolean NOT NULL DEFAULT false, "bulletKills" integer, "description" character varying(1000), "evidence" character varying(1000) NOT NULL, CONSTRAINT "PK_b3cfd86ca34c6118628491c5b16" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_a5d58251e544f2be7262f88300" ON "score_player" ("idScore") `);
    await queryRunner.query(
      `CREATE TABLE "score_world_record_character" ("id" SERIAL NOT NULL, "creationDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP DEFAULT now(), "createdBy" integer NOT NULL, "lastUpdatedBy" integer, "idScoreWorldRecord" integer NOT NULL, "idPlatformGameMiniGameModeCharacterCostume" integer NOT NULL, CONSTRAINT "PK_d16a3b201c7780ce1fdef252e90" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_980e55d01c0383636d21da3ddc" ON "score_world_record_character" ("idScoreWorldRecord") `
    );
    await queryRunner.query(
      `CREATE TYPE "score_world_record_type_enum" AS ENUM('World Record', 'Character World Record', 'Combination World Record')`
    );
    await queryRunner.query(
      `CREATE TABLE "score_world_record" ("id" SERIAL NOT NULL, "creationDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP DEFAULT now(), "createdBy" integer NOT NULL, "lastUpdatedBy" integer, "idScore" integer NOT NULL, "type" "score_world_record_type_enum" NOT NULL, "idPlatformGameMiniGameModeStage" integer NOT NULL, "endDate" TIMESTAMP, CONSTRAINT "PK_d13479ff708d3504f43cd1777a0" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "score_change_request" ("id" SERIAL NOT NULL, "creationDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP DEFAULT now(), "createdBy" integer NOT NULL, "lastUpdatedBy" integer, "idScore" integer NOT NULL, "description" character varying(1000) NOT NULL, "dateFulfilled" TIMESTAMP, CONSTRAINT "PK_76805bfa90f4ff152dcf655d390" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TYPE "score_status_enum" AS ENUM('Approved', 'Rejected by Admin', 'Rejected by Partner', 'Awaiting Approval of Admin', 'Awaiting Approval of Partner', 'Changes Requested')`
    );
    await queryRunner.query(
      `CREATE TABLE "score" ("id" SERIAL NOT NULL, "creationDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP DEFAULT now(), "createdBy" integer NOT NULL, "lastUpdatedBy" integer, "idPlatformGameMiniGameModeStage" integer NOT NULL, "score" integer NOT NULL, "maxCombo" integer NOT NULL, "time" character varying(8) NOT NULL, "status" "score_status_enum" NOT NULL, "createdByIdPlayer" integer NOT NULL, "approvalDate" TIMESTAMP, CONSTRAINT "PK_1770f42c61451103f5514134078" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_89d413dd56853dc54ff3f86640" ON "score" ("status") `);
    await queryRunner.query(`CREATE TYPE "score_approval_action_enum" AS ENUM('Approve', 'Reject')`);
    await queryRunner.query(
      `CREATE TABLE "score_approval" ("id" SERIAL NOT NULL, "creationDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP DEFAULT now(), "createdBy" integer NOT NULL, "lastUpdatedBy" integer, "idScore" integer NOT NULL, "actionDate" TIMESTAMP NOT NULL, "actionByPlayer" integer, "actionByAdmin" integer, "description" character varying(1000), "action" "score_approval_action_enum" NOT NULL, "idScoreApprovalMotive" integer NOT NULL, CONSTRAINT "PK_17ff86798702c77fe4a6d541f8b" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "player" ADD CONSTRAINT "FK_cf0cf42ae7ee371cac3c0176716" FOREIGN KEY ("idUser") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "player" ADD CONSTRAINT "FK_6bca1d865c497a4417f7a812e40" FOREIGN KEY ("idSteamProfile") REFERENCES "steam_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "player" ADD CONSTRAINT "FK_63d2eb3e0376495283cb45a511e" FOREIGN KEY ("idRegion") REFERENCES "region"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_3a049e28fbc10499c1739843ea8" FOREIGN KEY ("idCurrentAuthConfirmation") REFERENCES "auth_confirmation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "auth_confirmation" ADD CONSTRAINT "FK_d129f4913723f6d8f14c3e9c4ac" FOREIGN KEY ("idUser") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "game_mini_game" ADD CONSTRAINT "FK_76931ed13d3bfbcf7c7a2b5ca8e" FOREIGN KEY ("idGame") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "game_mini_game" ADD CONSTRAINT "FK_cc7250b59f9c797b18aa00c45cb" FOREIGN KEY ("idMiniGame") REFERENCES "mini_game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "platform_game_mini_game" ADD CONSTRAINT "FK_a5bc01acbee93e56dbae259a4cb" FOREIGN KEY ("idPlatform") REFERENCES "platform"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "platform_game_mini_game" ADD CONSTRAINT "FK_6b525d6209ce50ecf9b69366cd6" FOREIGN KEY ("idGameMiniGame") REFERENCES "game_mini_game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "platform_game_mini_game_mode_stage" ADD CONSTRAINT "FK_8c476e402d8aa275a2822790068" FOREIGN KEY ("idPlatformGameMiniGameMode") REFERENCES "platform_game_mini_game_mode"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "platform_game_mini_game_mode_stage" ADD CONSTRAINT "FK_245a93a6cd7cec049e61747032d" FOREIGN KEY ("idStage") REFERENCES "stage"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "platform_game_mini_game_mode" ADD CONSTRAINT "FK_59e416b906be9ceee0e96451b2f" FOREIGN KEY ("idPlatformGameMiniGame") REFERENCES "platform_game_mini_game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "platform_game_mini_game_mode" ADD CONSTRAINT "FK_ad4af4a1c43ca2186d4b95d77b2" FOREIGN KEY ("idMode") REFERENCES "mode"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "platform_game_mini_game_mode_character_costume" ADD CONSTRAINT "FK_4741c38d264d234f356c9046780" FOREIGN KEY ("idPlatformGameMiniGameMode") REFERENCES "platform_game_mini_game_mode"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "platform_game_mini_game_mode_character_costume" ADD CONSTRAINT "FK_4e9145c1c154320c9ece0de586c" FOREIGN KEY ("idCharacterCostume") REFERENCES "character_costume"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "character_costume" ADD CONSTRAINT "FK_d16683fb0550d617778979b29a6" FOREIGN KEY ("idCharacter") REFERENCES "character"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "score_player" ADD CONSTRAINT "FK_efa67e7ff29fc029a57f585265c" FOREIGN KEY ("idScore") REFERENCES "score"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "score_player" ADD CONSTRAINT "FK_752cce38f5606cd3967a7b5d799" FOREIGN KEY ("idPlayer") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "score_player" ADD CONSTRAINT "FK_d7116ad671486cadb831a894b91" FOREIGN KEY ("idPlatformGameMiniGameModeCharacterCostume") REFERENCES "platform_game_mini_game_mode_character_costume"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "score_world_record_character" ADD CONSTRAINT "FK_ba7b8b3a692bcc8ccff0829de3f" FOREIGN KEY ("idScoreWorldRecord") REFERENCES "score_world_record"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "score_world_record_character" ADD CONSTRAINT "FK_89aae9bccfe0579e1c826a5bd36" FOREIGN KEY ("idPlatformGameMiniGameModeCharacterCostume") REFERENCES "platform_game_mini_game_mode_character_costume"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "score_world_record" ADD CONSTRAINT "FK_6c5fa9569e1b43b29d780d524f5" FOREIGN KEY ("idScore") REFERENCES "score"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "score_world_record" ADD CONSTRAINT "FK_ee1b7e2597c8cf1a029618c64f1" FOREIGN KEY ("idPlatformGameMiniGameModeStage") REFERENCES "platform_game_mini_game_mode_stage"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "score_change_request" ADD CONSTRAINT "FK_66104643724acebcf6af7aa8a14" FOREIGN KEY ("idScore") REFERENCES "score"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "score" ADD CONSTRAINT "FK_fcdd4ec80dda23fa79093a93312" FOREIGN KEY ("idPlatformGameMiniGameModeStage") REFERENCES "platform_game_mini_game_mode_stage"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "score" ADD CONSTRAINT "FK_319d7141a1fad36a26b3babe01e" FOREIGN KEY ("createdByIdPlayer") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "score_approval" ADD CONSTRAINT "FK_5bb0a9e1938c51f6677e4b016e7" FOREIGN KEY ("idScore") REFERENCES "score"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "score_approval" ADD CONSTRAINT "FK_2d388a480ea75fbdb9539f2681d" FOREIGN KEY ("actionByPlayer") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "score_approval" ADD CONSTRAINT "FK_2f5bfe6dd3b90f27717e989f89e" FOREIGN KEY ("actionByAdmin") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "score_approval" ADD CONSTRAINT "FK_2f2aad512ba58a11f2f6e1d4bc7" FOREIGN KEY ("idScoreApprovalMotive") REFERENCES "score_approval_motive"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  async down(queryRunner) {
    await queryRunner.query(`ALTER TABLE "score_approval" DROP CONSTRAINT "FK_2f2aad512ba58a11f2f6e1d4bc7"`);
    await queryRunner.query(`ALTER TABLE "score_approval" DROP CONSTRAINT "FK_2f5bfe6dd3b90f27717e989f89e"`);
    await queryRunner.query(`ALTER TABLE "score_approval" DROP CONSTRAINT "FK_2d388a480ea75fbdb9539f2681d"`);
    await queryRunner.query(`ALTER TABLE "score_approval" DROP CONSTRAINT "FK_5bb0a9e1938c51f6677e4b016e7"`);
    await queryRunner.query(`ALTER TABLE "score" DROP CONSTRAINT "FK_319d7141a1fad36a26b3babe01e"`);
    await queryRunner.query(`ALTER TABLE "score" DROP CONSTRAINT "FK_fcdd4ec80dda23fa79093a93312"`);
    await queryRunner.query(`ALTER TABLE "score_change_request" DROP CONSTRAINT "FK_66104643724acebcf6af7aa8a14"`);
    await queryRunner.query(`ALTER TABLE "score_world_record" DROP CONSTRAINT "FK_ee1b7e2597c8cf1a029618c64f1"`);
    await queryRunner.query(`ALTER TABLE "score_world_record" DROP CONSTRAINT "FK_6c5fa9569e1b43b29d780d524f5"`);
    await queryRunner.query(
      `ALTER TABLE "score_world_record_character" DROP CONSTRAINT "FK_89aae9bccfe0579e1c826a5bd36"`
    );
    await queryRunner.query(
      `ALTER TABLE "score_world_record_character" DROP CONSTRAINT "FK_ba7b8b3a692bcc8ccff0829de3f"`
    );
    await queryRunner.query(`ALTER TABLE "score_player" DROP CONSTRAINT "FK_d7116ad671486cadb831a894b91"`);
    await queryRunner.query(`ALTER TABLE "score_player" DROP CONSTRAINT "FK_752cce38f5606cd3967a7b5d799"`);
    await queryRunner.query(`ALTER TABLE "score_player" DROP CONSTRAINT "FK_efa67e7ff29fc029a57f585265c"`);
    await queryRunner.query(`ALTER TABLE "character_costume" DROP CONSTRAINT "FK_d16683fb0550d617778979b29a6"`);
    await queryRunner.query(
      `ALTER TABLE "platform_game_mini_game_mode_character_costume" DROP CONSTRAINT "FK_4e9145c1c154320c9ece0de586c"`
    );
    await queryRunner.query(
      `ALTER TABLE "platform_game_mini_game_mode_character_costume" DROP CONSTRAINT "FK_4741c38d264d234f356c9046780"`
    );
    await queryRunner.query(
      `ALTER TABLE "platform_game_mini_game_mode" DROP CONSTRAINT "FK_ad4af4a1c43ca2186d4b95d77b2"`
    );
    await queryRunner.query(
      `ALTER TABLE "platform_game_mini_game_mode" DROP CONSTRAINT "FK_59e416b906be9ceee0e96451b2f"`
    );
    await queryRunner.query(
      `ALTER TABLE "platform_game_mini_game_mode_stage" DROP CONSTRAINT "FK_245a93a6cd7cec049e61747032d"`
    );
    await queryRunner.query(
      `ALTER TABLE "platform_game_mini_game_mode_stage" DROP CONSTRAINT "FK_8c476e402d8aa275a2822790068"`
    );
    await queryRunner.query(`ALTER TABLE "platform_game_mini_game" DROP CONSTRAINT "FK_6b525d6209ce50ecf9b69366cd6"`);
    await queryRunner.query(`ALTER TABLE "platform_game_mini_game" DROP CONSTRAINT "FK_a5bc01acbee93e56dbae259a4cb"`);
    await queryRunner.query(`ALTER TABLE "game_mini_game" DROP CONSTRAINT "FK_cc7250b59f9c797b18aa00c45cb"`);
    await queryRunner.query(`ALTER TABLE "game_mini_game" DROP CONSTRAINT "FK_76931ed13d3bfbcf7c7a2b5ca8e"`);
    await queryRunner.query(`ALTER TABLE "auth_confirmation" DROP CONSTRAINT "FK_d129f4913723f6d8f14c3e9c4ac"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_3a049e28fbc10499c1739843ea8"`);
    await queryRunner.query(`ALTER TABLE "player" DROP CONSTRAINT "FK_63d2eb3e0376495283cb45a511e"`);
    await queryRunner.query(`ALTER TABLE "player" DROP CONSTRAINT "FK_6bca1d865c497a4417f7a812e40"`);
    await queryRunner.query(`ALTER TABLE "player" DROP CONSTRAINT "FK_cf0cf42ae7ee371cac3c0176716"`);
    await queryRunner.query(`DROP TABLE "score_approval"`);
    await queryRunner.query(`DROP TYPE "score_approval_action_enum"`);
    await queryRunner.query(`DROP INDEX "IDX_89d413dd56853dc54ff3f86640"`);
    await queryRunner.query(`DROP TABLE "score"`);
    await queryRunner.query(`DROP TYPE "score_status_enum"`);
    await queryRunner.query(`DROP TABLE "score_change_request"`);
    await queryRunner.query(`DROP TABLE "score_world_record"`);
    await queryRunner.query(`DROP TYPE "score_world_record_type_enum"`);
    await queryRunner.query(`DROP INDEX "IDX_980e55d01c0383636d21da3ddc"`);
    await queryRunner.query(`DROP TABLE "score_world_record_character"`);
    await queryRunner.query(`DROP INDEX "IDX_a5d58251e544f2be7262f88300"`);
    await queryRunner.query(`DROP TABLE "score_player"`);
    await queryRunner.query(`DROP TABLE "score_approval_motive"`);
    await queryRunner.query(`DROP TYPE "score_approval_motive_action_enum"`);
    await queryRunner.query(`DROP INDEX "IDX_00bb7c711ff4189090801224e4"`);
    await queryRunner.query(`DROP INDEX "IDX_80071a3e68f6f585127b9dc73c"`);
    await queryRunner.query(`DROP TABLE "character_costume"`);
    await queryRunner.query(`DROP TABLE "platform_game_mini_game_mode_character_costume"`);
    await queryRunner.query(`DROP TABLE "platform_game_mini_game_mode"`);
    await queryRunner.query(`DROP TABLE "platform_game_mini_game_mode_stage"`);
    await queryRunner.query(`DROP INDEX "IDX_10441b2716f7fc77c6bded3d0d"`);
    await queryRunner.query(`DROP INDEX "IDX_cbeb0a0f411c8b0879565811d0"`);
    await queryRunner.query(`DROP TABLE "stage"`);
    await queryRunner.query(`DROP INDEX "IDX_6b2cb7f89d46fd760279936e30"`);
    await queryRunner.query(`DROP TABLE "mode"`);
    await queryRunner.query(`DROP TABLE "platform_game_mini_game"`);
    await queryRunner.query(`DROP TABLE "game_mini_game"`);
    await queryRunner.query(`DROP INDEX "IDX_dcead769fe71a7e8905c89fdf5"`);
    await queryRunner.query(`DROP TABLE "mini_game"`);
    await queryRunner.query(`DROP INDEX "IDX_9cf39b223f4b2b4eb21978863d"`);
    await queryRunner.query(`DROP INDEX "IDX_5d1e08e04b97aa06d671cd5840"`);
    await queryRunner.query(`DROP TABLE "game"`);
    await queryRunner.query(`DROP INDEX "IDX_bb9295defd618944c5a554466f"`);
    await queryRunner.query(`DROP INDEX "IDX_b9b57ec16b9c2ac927aa62b8b3"`);
    await queryRunner.query(`DROP TABLE "platform"`);
    await queryRunner.query(`DROP INDEX "IDX_d80158dde1461b74ed8499e7d8"`);
    await queryRunner.query(`DROP TABLE "character"`);
    await queryRunner.query(`DROP TABLE "auth_confirmation"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "player"`);
    await queryRunner.query(`DROP TABLE "region"`);
    await queryRunner.query(`DROP TABLE "steam_profile"`);
  }
};
