-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.30 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for freelance_marketplace
CREATE DATABASE IF NOT EXISTS `freelance_marketplace` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `freelance_marketplace`;

-- Dumping structure for table freelance_marketplace.conversations
CREATE TABLE IF NOT EXISTS `conversations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user1_id` int NOT NULL,
  `user2_id` int NOT NULL,
  `user_low_id` int NOT NULL,
  `user_high_id` int NOT NULL,
  `last_message` text,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_pair` (`user_low_id`,`user_high_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table freelance_marketplace.conversations: ~0 rows (approximately)
DELETE FROM `conversations`;

-- Dumping structure for table freelance_marketplace.disputes
CREATE TABLE IF NOT EXISTS `disputes` (
  `dispute_id` int NOT NULL AUTO_INCREMENT,
  `job_id` int NOT NULL,
  `client` varchar(255) NOT NULL,
  `freelancer` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `resolved` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `client_argument` text,
  `freelancer_argument` text,
  PRIMARY KEY (`dispute_id`),
  UNIQUE KEY `unique_job_dispute` (`job_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table freelance_marketplace.disputes: ~1 rows (approximately)
DELETE FROM `disputes`;

-- Dumping structure for table freelance_marketplace.file_notes
CREATE TABLE IF NOT EXISTS `file_notes` (
  `note_id` int NOT NULL AUTO_INCREMENT,
  `file_id` int NOT NULL,
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `added_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `added_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`note_id`) USING BTREE,
  KEY `file_id` (`file_id`),
  CONSTRAINT `file_notes_ibfk_1` FOREIGN KEY (`file_id`) REFERENCES `job_files` (`file_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table freelance_marketplace.file_notes: ~0 rows (approximately)
DELETE FROM `file_notes`;

-- Dumping structure for table freelance_marketplace.jobs
CREATE TABLE IF NOT EXISTS `jobs` (
  `job_id` int NOT NULL AUTO_INCREMENT,
  `contractJobId` int NOT NULL,
  `client` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `freelancer` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `amount` decimal(18,8) NOT NULL,
  `status` enum('Pending','Accepted','Completed','Disputed','Declined') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'Pending',
  `blockNumber` int DEFAULT NULL,
  `transactionHash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `voteable` tinyint(1) DEFAULT '0',
  `job_type` enum('ClientToFreelancer','FreelancerToClient') NOT NULL DEFAULT 'ClientToFreelancer',
  PRIMARY KEY (`job_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table freelance_marketplace.jobs: ~1 rows (approximately)
DELETE FROM `jobs`;

-- Dumping structure for table freelance_marketplace.job_applications
CREATE TABLE IF NOT EXISTS `job_applications` (
  `application_id` int NOT NULL AUTO_INCREMENT,
  `job_id` int NOT NULL,
  `freelancer` varchar(255) NOT NULL,
  `cover_letter` text NOT NULL,
  `expected_amount` decimal(18,8) DEFAULT NULL,
  `portfolio_url` varchar(255) DEFAULT NULL,
  `timezone` varchar(100) DEFAULT NULL,
  `status` enum('Submitted','Reviewed','Accepted','Rejected') DEFAULT 'Submitted',
  `submitted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`application_id`),
  KEY `job_id` (`job_id`),
  CONSTRAINT `job_applications_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`job_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table freelance_marketplace.job_applications: ~0 rows (approximately)
DELETE FROM `job_applications`;

-- Dumping structure for table freelance_marketplace.job_details
CREATE TABLE IF NOT EXISTS `job_details` (
  `job_details_id` int NOT NULL AUTO_INCREMENT,
  `job_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `category_id` int DEFAULT NULL,
  `cover_letter` text,
  `deadline` date DEFAULT NULL,
  `delivery_format` varchar(255) DEFAULT NULL,
  `timezone` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`job_details_id`),
  KEY `job_id` (`job_id`),
  CONSTRAINT `job_details_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`job_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table freelance_marketplace.job_details: ~0 rows (approximately)
DELETE FROM `job_details`;

-- Dumping structure for table freelance_marketplace.job_files
CREATE TABLE IF NOT EXISTS `job_files` (
  `file_id` int NOT NULL AUTO_INCREMENT,
  `job_id` int NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_type` varchar(50) DEFAULT NULL,
  `visibility` enum('ClientOnly','FreelancerOnly','Both') DEFAULT 'Both',
  `uploaded_by` enum('Client','Freelancer') NOT NULL,
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`file_id`),
  KEY `job_id` (`job_id`),
  CONSTRAINT `job_files_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`job_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table freelance_marketplace.job_files: ~0 rows (approximately)
DELETE FROM `job_files`;

-- Dumping structure for table freelance_marketplace.messages
CREATE TABLE IF NOT EXISTS `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `conversation_id` int NOT NULL,
  `sender_id` int NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_read` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_conversation_id` (`conversation_id`),
  KEY `idx_sender_id` (`sender_id`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table freelance_marketplace.messages: ~0 rows (approximately)
DELETE FROM `messages`;

-- Dumping structure for table freelance_marketplace.skills
CREATE TABLE IF NOT EXISTS `skills` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=231 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table freelance_marketplace.skills: ~101 rows (approximately)
DELETE FROM `skills`;
INSERT INTO `skills` (`id`, `name`, `created_at`, `updated_at`) VALUES
	(1, 'HTML', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(2, 'CSS', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(3, 'JavaScript', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(4, 'TypeScript', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(5, 'React', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(6, 'Vue.js', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(7, 'Angular', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(8, 'Next.js', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(9, 'Nuxt.js', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(10, 'PHP', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(11, 'Laravel', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(12, 'Node.js', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(13, 'Express.js', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(14, 'MySQL', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(15, 'PostgreSQL', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(16, 'MongoDB', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(17, 'Python', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(18, 'Django', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(19, 'Flask', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(20, 'Java', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(21, 'Spring Boot', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(22, '.NET', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(23, 'Docker', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(24, 'Kubernetes', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(25, 'AWS', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(26, 'Azure', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(27, 'CI/CD', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(28, 'REST API', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(29, 'GraphQL', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(30, 'Solidity', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(31, 'Ethereum', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(32, 'Hardhat', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(33, 'Truffle', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(34, 'Web3.js', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(35, 'Ethers.js', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(36, 'IPFS', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(37, 'Smart Contracts', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(38, 'NFT Development', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(39, 'dApp Development', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(40, 'Figma', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(41, 'Adobe XD', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(42, 'Sketch', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(43, 'UI Design', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(44, 'UX Research', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(45, 'Web Design', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(46, 'Graphic Design', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(47, 'React Native', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(48, 'Flutter', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(49, 'Swift', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(50, 'Kotlin', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(51, 'Android SDK', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(52, 'iOS Development', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(53, 'SEO', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(54, 'WordPress', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(55, 'Shopify', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(56, 'Content Writing', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(57, 'Copywriting', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(58, 'Data Entry', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(59, 'Virtual Assistant', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(60, 'Project Management', '2025-06-01 13:36:07', '2025-06-01 13:36:07'),
	(190, 'Video Editing', '2025-06-01 13:37:07', '2025-06-01 13:37:07'),
	(191, 'Motion Graphics', '2025-06-01 13:37:07', '2025-06-01 13:37:07'),
	(192, 'Adobe Premiere Pro', '2025-06-01 13:37:07', '2025-06-01 13:37:07'),
	(193, 'Final Cut Pro', '2025-06-01 13:37:07', '2025-06-01 13:37:07'),
	(194, 'After Effects', '2025-06-01 13:37:07', '2025-06-01 13:37:07'),
	(195, 'Color Grading', '2025-06-01 13:37:07', '2025-06-01 13:37:07'),
	(196, 'Audio Editing', '2025-06-01 13:37:07', '2025-06-01 13:37:07'),
	(197, 'Podcast Editing', '2025-06-01 13:37:07', '2025-06-01 13:37:07'),
	(198, 'Sound Design', '2025-06-01 13:37:07', '2025-06-01 13:37:07'),
	(199, 'Voice Over', '2025-06-01 13:37:07', '2025-06-01 13:37:07'),
	(200, 'Photography', '2025-06-01 13:37:07', '2025-06-01 13:37:07'),
	(201, 'Photo Editing', '2025-06-01 13:37:07', '2025-06-01 13:37:07'),
	(202, 'Adobe Photoshop', '2025-06-01 13:37:07', '2025-06-01 13:37:07'),
	(203, 'Adobe Lightroom', '2025-06-01 13:37:07', '2025-06-01 13:37:07'),
	(204, 'Retouching', '2025-06-01 13:37:07', '2025-06-01 13:37:07'),
	(205, 'Image Background Removal', '2025-06-01 13:37:07', '2025-06-01 13:37:07'),
	(206, 'Creative Writing', '2025-06-01 13:37:07', '2025-06-01 13:37:07'),
	(207, 'Blog Writing', '2025-06-01 13:37:07', '2025-06-01 13:37:07'),
	(208, 'Technical Writing', '2025-06-01 13:37:07', '2025-06-01 13:37:07'),
	(209, 'Scriptwriting', '2025-06-01 13:37:07', '2025-06-01 13:37:07'),
	(210, 'Editing & Proofreading', '2025-06-01 13:37:07', '2025-06-01 13:37:07'),
	(211, 'Resume Writing', '2025-06-01 13:37:07', '2025-06-01 13:37:07'),
	(212, 'Translation', '2025-06-01 13:37:07', '2025-06-01 13:37:07'),
	(213, 'Transcription', '2025-06-01 13:37:07', '2025-06-01 13:37:07'),
	(214, 'Digital Marketing', '2025-06-01 13:37:07', '2025-06-01 13:37:07'),
	(215, 'Social Media Marketing', '2025-06-01 13:37:07', '2025-06-01 13:37:07'),
	(216, 'Email Marketing', '2025-06-01 13:37:07', '2025-06-01 13:37:07'),
	(217, 'Content Marketing', '2025-06-01 13:37:07', '2025-06-01 13:37:07'),
	(218, 'Google Ads', '2025-06-01 13:37:07', '2025-06-01 13:37:07'),
	(219, 'Facebook Ads', '2025-06-01 13:37:07', '2025-06-01 13:37:07'),
	(220, 'Influencer Marketing', '2025-06-01 13:37:07', '2025-06-01 13:37:07'),
	(221, 'Branding', '2025-06-01 13:37:07', '2025-06-01 13:37:07'),
	(222, 'Marketing Strategy', '2025-06-01 13:37:07', '2025-06-01 13:37:07'),
	(223, 'Affiliate Marketing', '2025-06-01 13:37:07', '2025-06-01 13:37:07'),
	(224, 'Market Research', '2025-06-01 13:37:07', '2025-06-01 13:37:07'),
	(225, 'Data Analysis', '2025-06-01 13:37:07', '2025-06-01 13:37:07'),
	(226, 'Microsoft Excel', '2025-06-01 13:37:07', '2025-06-01 13:37:07'),
	(227, 'Google Sheets', '2025-06-01 13:37:07', '2025-06-01 13:37:07'),
	(228, 'Web Research', '2025-06-01 13:37:07', '2025-06-01 13:37:07'),
	(229, 'Internet Research', '2025-06-01 13:37:07', '2025-06-01 13:37:07'),
	(230, 'Customer Support', '2025-06-01 13:37:07', '2025-06-01 13:37:07');

-- Dumping structure for table freelance_marketplace.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `display_name` varchar(255) DEFAULT NULL,
  `wallet_address` varchar(42) DEFAULT NULL,
  `role` enum('client','freelancer') DEFAULT 'freelancer',
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table freelance_marketplace.users: ~4 rows (approximately)
DELETE FROM `users`;
INSERT INTO `users` (`id`, `username`, `display_name`, `wallet_address`, `role`, `email`, `password`, `created_at`, `updated_at`) VALUES
	(2, 'alex', 'XerionV', NULL, 'freelancer', 'alex@gmail.com', '$2b$10$ZqcW4fVxI8nF4eRtRkUR8ubGwq7RiHHqIoNaoLied1TginwNYb2oa', '2025-06-01 13:29:47', '2025-06-01 14:45:06'),
	(3, 'saya', NULL, NULL, 'freelancer', 'saya@gmail.com', '$2b$10$1xW1U.dqsRY2Xovnblxjyemul5y6JM902I6QZXywY9lK8xkvqo3We', '2025-06-01 13:29:47', '2025-06-01 13:29:47'),
	(4, 'anda', NULL, NULL, 'freelancer', 'anda@gmail.com', '$2b$10$wElRtnjR60Km5i6EmDXWvOPdkclu3V1K68saxoEJO5vZ1Ebw38gwG', '2025-06-01 13:29:47', '2025-06-01 13:29:47'),
	(5, 'worker', NULL, NULL, 'freelancer', 'worker@gmail.com', '$2b$10$8Go7sz4vEc5iWW9hd1VdKe3Ddgk9VZg6Lmtp/WCbqxGZZFYIVqV1K', '2025-06-01 13:29:47', '2025-06-01 13:29:47'),
	(7, 'worker1', 'Worker1', '0x23618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f', 'freelancer', 'worker1@gmail.com', '$2b$10$.X4QYk93gG7E6AAdTQ32YOGeHdFPgIOQCqAFkNNW6gPPQXYUoIAji', '2025-06-01 16:09:52', '2025-06-01 16:09:52');

-- Dumping structure for table freelance_marketplace.user_profiles
CREATE TABLE IF NOT EXISTS `user_profiles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `bio` text,
  `profile_picture_url` varchar(512) DEFAULT NULL,
  `experience_level` enum('beginner','intermediate','expert') DEFAULT NULL,
  `portfolio_url` varchar(512) DEFAULT NULL,
  `rating` decimal(3,2) DEFAULT '0.00',
  `completed_jobs` int DEFAULT '0',
  `is_verified` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `hourly_rate` decimal(10,2) DEFAULT NULL,
  `availability` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table freelance_marketplace.user_profiles: ~1 rows (approximately)
DELETE FROM `user_profiles`;
INSERT INTO `user_profiles` (`id`, `user_id`, `bio`, `profile_picture_url`, `experience_level`, `portfolio_url`, `rating`, `completed_jobs`, `is_verified`, `created_at`, `updated_at`, `hourly_rate`, `availability`) VALUES
	(1, 7, '15+ years in web3 developments', '/uploads/avatars/avatar_7_1748870028289.jpg', 'expert', 'www.link.com', 3.50, 0, 0, '2025-06-01 16:09:52', '2025-06-03 13:47:14', 1.00, 'Available');

-- Dumping structure for table freelance_marketplace.user_skills
CREATE TABLE IF NOT EXISTS `user_skills` (
  `user_id` int NOT NULL,
  `skill_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`skill_id`),
  KEY `skill_id` (`skill_id`),
  CONSTRAINT `user_skills_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_skills_ibfk_2` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table freelance_marketplace.user_skills: ~2 rows (approximately)
DELETE FROM `user_skills`;
INSERT INTO `user_skills` (`user_id`, `skill_id`, `created_at`) VALUES
	(7, 31, '2025-06-02 12:59:33'),
	(7, 34, '2025-06-02 12:59:33');

-- Dumping structure for table freelance_marketplace.votes
CREATE TABLE IF NOT EXISTS `votes` (
  `vote_id` int NOT NULL AUTO_INCREMENT,
  `jobId` int NOT NULL,
  `voter` varchar(255) NOT NULL,
  `voteFor` tinyint(1) NOT NULL,
  `dispute_id` int DEFAULT NULL,
  PRIMARY KEY (`vote_id`),
  UNIQUE KEY `unique_vote` (`jobId`,`voter`),
  KEY `fk_dispute_id` (`dispute_id`),
  CONSTRAINT `fk_dispute_id` FOREIGN KEY (`dispute_id`) REFERENCES `disputes` (`dispute_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table freelance_marketplace.votes: ~0 rows (approximately)
DELETE FROM `votes`;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
