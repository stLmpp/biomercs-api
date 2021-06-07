const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class mailQueue1623030356719 {
    name = 'mailQueue1623030356719'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TYPE "mail_queue_textencoding_enum" AS ENUM('quoted-printable', 'base64')`);
        await queryRunner.query(`CREATE TABLE "mail_queue" ("creationDate" TIMESTAMP NOT NULL DEFAULT now(), "lastUpdatedDate" TIMESTAMP DEFAULT now(), "createdBy" integer NOT NULL, "lastUpdatedBy" integer, "id" SERIAL NOT NULL, "template" character varying NOT NULL, "context" json NOT NULL, "from" character varying NOT NULL, "to" character varying array NOT NULL, "cc" character varying array, "bcc" character varying array, "replyTo" character varying, "inReplyTo" character varying, "subject" character varying, "text" character varying, "html" character varying, "sender" character varying, "raw" character varying, "textEncoding" "mail_queue_textencoding_enum", "references" character varying, "encoding" character varying, "date" TIMESTAMP, "transporterName" character varying, CONSTRAINT "PK_fc59283e1a31da3ce216089305b" PRIMARY KEY ("id"))`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "mail_queue"`);
        await queryRunner.query(`DROP TYPE "mail_queue_textencoding_enum"`);
    }
}
