/*
  Warnings:

  - Added the required column `senha` to the `Clientes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Clientes` ADD COLUMN `senha` VARCHAR(255) NOT NULL,
    MODIFY `ativo` TINYINT UNSIGNED NOT NULL DEFAULT true;
