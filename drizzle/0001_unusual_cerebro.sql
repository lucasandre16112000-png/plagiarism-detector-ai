CREATE TABLE `ai_detection_results` (
	`id` int AUTO_INCREMENT NOT NULL,
	`analysisId` int NOT NULL,
	`textSegment` text NOT NULL,
	`aiProbability` float NOT NULL,
	`startPosition` int NOT NULL,
	`endPosition` int NOT NULL,
	`detectionMethod` varchar(100) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ai_detection_results_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `analyses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`documentId` int NOT NULL,
	`userId` int NOT NULL,
	`plagiarismPercentage` float NOT NULL DEFAULT 0,
	`aiContentPercentage` float NOT NULL DEFAULT 0,
	`confidenceScore` float NOT NULL DEFAULT 0,
	`totalSources` int NOT NULL DEFAULT 0,
	`status` enum('pending','processing','completed','failed') NOT NULL DEFAULT 'pending',
	`errorMessage` text,
	`analysisData` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `analyses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`filename` varchar(255) NOT NULL,
	`originalFilename` varchar(255) NOT NULL,
	`fileType` varchar(50) NOT NULL,
	`fileSize` int NOT NULL,
	`s3Key` text NOT NULL,
	`s3Url` text NOT NULL,
	`extractedText` text,
	`status` enum('pending','processing','completed','failed') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `plagiarism_sources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`analysisId` int NOT NULL,
	`sourceUrl` text,
	`sourceTitle` text,
	`sourceType` varchar(50) NOT NULL,
	`similarityScore` float NOT NULL,
	`matchedText` text,
	`originalText` text,
	`startPosition` int,
	`endPosition` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `plagiarism_sources_id` PRIMARY KEY(`id`)
);
