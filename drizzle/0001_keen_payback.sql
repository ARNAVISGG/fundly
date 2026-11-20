CREATE TABLE `newsStories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(120) NOT NULL,
	`title` varchar(220) NOT NULL,
	`dek` text NOT NULL,
	`body` text NOT NULL,
	`creator` varchar(160) NOT NULL,
	`status` enum('sample','verified') NOT NULL DEFAULT 'sample',
	`published` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `newsStories_id` PRIMARY KEY(`id`),
	CONSTRAINT `newsStories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `walletTransactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`transactionId` varchar(80) NOT NULL,
	`userId` int NOT NULL,
	`type` enum('deposit','withdrawal') NOT NULL,
	`amount` int NOT NULL,
	`balanceAfter` int NOT NULL,
	`status` enum('completed') NOT NULL DEFAULT 'completed',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `walletTransactions_id` PRIMARY KEY(`id`),
	CONSTRAINT `walletTransactions_transactionId_unique` UNIQUE(`transactionId`)
);
--> statement-breakpoint
CREATE TABLE `wallets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`balance` int NOT NULL DEFAULT 0,
	`totalAdded` int NOT NULL DEFAULT 0,
	`totalWithdrawn` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `wallets_id` PRIMARY KEY(`id`),
	CONSTRAINT `wallets_userId_unique` UNIQUE(`userId`)
);
