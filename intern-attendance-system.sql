-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 12, 2026 at 12:13 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 7.4.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `intern-attendance-system`
--

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `id` int(11) NOT NULL,
  `internId` int(11) NOT NULL,
  `date` datetime(3) NOT NULL,
  `inTime` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `outTime` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Inside'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`id`, `internId`, `date`, `inTime`, `outTime`, `status`) VALUES
(1, 2, '2026-03-11 11:42:06.744', '5:12:06 pm', '5:25:11 pm', 'Completed'),
(5, 2, '2026-03-12 04:31:27.064', '10:01:27 am', '10:01:34 am', 'Completed'),
(6, 8, '2026-03-12 10:36:32.047', '4:06:32 pm', '4:15:44 pm', 'Completed'),
(7, 7, '2026-03-12 10:36:41.188', '4:06:41 pm', '4:21:45 pm', 'Completed');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `doj` datetime DEFAULT NULL,
  `role` int(11) DEFAULT NULL,
  `dept` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `repMgr` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `email`, `password`, `doj`, `role`, `dept`, `phone`, `repMgr`, `status`, `createdAt`) VALUES
(1, 'Security Guard', 'guard@mipl.com', '$2b$10$Mrlbr5EJ3toCFTprpQS4Ke.q7xws1ToA2MoQBYWGXVBpva5TIfTsi', NULL, 4, '', '0', '', 'active', '2026-03-11 17:11:12.000'),
(2, 'Intern User', 'intern@mipl.com', '$2b$10$Mrlbr5EJ3toCFTprpQS4Ke.q7xws1ToA2MoQBYWGXVBpva5TIfTsi', NULL, 3, '', '0', '', 'active', '2026-03-11 17:11:12.000'),
(3, 'HR User', 'hr@mipl.com', '$2b$10$Mrlbr5EJ3toCFTprpQS4Ke.q7xws1ToA2MoQBYWGXVBpva5TIfTsi', NULL, 2, '', '0', '', 'active', '2026-03-11 17:11:12.000'),
(4, 'Admin User', 'admin@mipl.com', '$2b$10$Mrlbr5EJ3toCFTprpQS4Ke.q7xws1ToA2MoQBYWGXVBpva5TIfTsi', NULL, 1, '', '0', '', 'active', '2026-03-11 17:11:12.000'),
(7, 'sagar', 'sagar@mipl.com', '$2b$10$Mrlbr5EJ3toCFTprpQS4Ke.q7xws1ToA2MoQBYWGXVBpva5TIfTsi', '2026-03-11 00:00:00', 3, 'Testing', '1212312345', 'Naman', 'active', '2026-03-12 08:20:49.506'),
(8, 'Kajal', 'kajal@mipl.com', NULL, '2026-03-03 00:00:00', 3, 'IT', '4455534344', 'Naman', 'active', '2026-03-12 10:11:03.945');

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('0add5232-0441-4f2c-843b-758c880f0547', '95f4601a58e61f5ee78a086ae5391a660a836a720c81ef448bd503600a21c503', '2026-03-12 06:16:32.989', '20260312061632_user_table_user', NULL, NULL, '2026-03-12 06:16:32.926', 1),
('122baf86-c598-4b06-8cee-813b344fa8dc', '4ea9e4b945e2f5e2e42e82c7e34ed0c80b44c17624a945794d9e03c9bb58cffd', '2026-03-11 11:38:48.316', '20260311055217_add_created_at', NULL, NULL, '2026-03-11 11:38:48.284', 1),
('25ee2b0c-05ee-4fb1-bd8c-84e4afef0226', '1d0352f5430ff33bb0168044f1fb1c628b8cb3e5a70b6d9b25e8faf78489ba0a', '2026-03-12 04:17:31.557', '20260312041731_add_status', NULL, NULL, '2026-03-12 04:17:31.518', 1),
('4f2a2611-77d5-4013-8912-574450b5e4b7', '0b11607895e239c5dc5220a990ed4082c310acaef13483318f2a92a1da3b4ccc', '2026-03-11 11:38:48.281', '20260311041848_init', NULL, NULL, '2026-03-11 11:38:48.110', 1),
('7ac4c150-a224-43f8-8b7d-12629d03f454', '05519501b94dc614ff21337229aae55ba61fd994d99a9aa1f7ca305c910c1978', '2026-03-12 04:05:46.106', '20260312040545_update_attendance', NULL, NULL, '2026-03-12 04:05:45.914', 1),
('9c3b5c41-f52e-4b97-b629-a304498741f8', 'bfa6f2754fcfae5e3146e9f9b5f77822df46fa80ea351f9c7754acf075fd45e6', '2026-03-11 11:38:48.349', '20260311055552_add_password_to_user', NULL, NULL, '2026-03-11 11:38:48.318', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Attendance_internId_fkey` (`internId`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_email_key` (`email`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `Attendance_internId_fkey` FOREIGN KEY (`internId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
