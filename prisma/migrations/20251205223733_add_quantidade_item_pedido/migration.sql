-- AlterTable
ALTER TABLE `Clientes` MODIFY `ativo` TINYINT UNSIGNED NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `ItemPedido` ADD COLUMN `quantidade` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `Produtos` ADD COLUMN `descricao` VARCHAR(1000) NOT NULL DEFAULT '';
