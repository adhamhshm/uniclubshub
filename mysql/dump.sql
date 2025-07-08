CREATE DATABASE  IF NOT EXISTS `db_uniclubshub` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `db_uniclubshub`;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: db_uniclubshub
-- ------------------------------------------------------
-- Server version	8.0.34

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activities`
--

DROP TABLE IF EXISTS `activities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `receiverUserId` varchar(45) DEFAULT NULL,
  `postId` varchar(300) DEFAULT NULL,
  `senderUserId` varchar(45) DEFAULT NULL,
  `activityDescription` varchar(150) DEFAULT NULL,
  `activityType` varchar(10) DEFAULT NULL,
  `hasRead` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `activitiesPostId_idx` (`postId`)
) ENGINE=InnoDB AUTO_INCREMENT=1124 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activities`
--

LOCK TABLES `activities` WRITE;
/*!40000 ALTER TABLE `activities` DISABLE KEYS */;
INSERT INTO `activities` VALUES (1106,'C00001','n/a','1111111111',' is now following you.','follow','yes'),(1107,'C00003','n/a','1111111111',' is now following you.','follow','no'),(1108,'C00007','n/a','1111111111',' is now following you.','follow','no'),(1111,'C00007','20231126221437645_447','1111111111',' liked your post: ','like','no'),(1112,'C00001','20231127020842743_838','1111111111',' liked your post: ','like','yes'),(1118,'C00001','20231126164539605_314','1111111111',' liked your post: ','like','yes'),(1120,'C00007','20231126221355248_255','1111111111',' liked your post: ','like','no'),(1121,'C00001','20231126164539605_314','1111111111',' registered for your event: ','register','no'),(1122,'C00007','20231126221355248_255','1111111111',' registered for your event: ','register','no'),(1123,'C00007','20231126221437645_447','1111111111',' registered for your event: ','register','no');
/*!40000 ALTER TABLE `activities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(300) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `postId` varchar(300) NOT NULL,
  `userId` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `clubPostId_idx` (`postId`),
  KEY `clubAccountId_idx` (`userId`),
  CONSTRAINT `clubPostId` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=139 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (136,'Wow interesting!','2023-12-02 03:22:01','20231126164539605_314','1111111111'),(137,'Do join our event ?','2023-12-02 03:36:36','20231126164539605_314','C00001'),(138,'Masyaallah ','2023-12-07 14:41:45','20231126180800561_612','1111111111');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `committees`
--

DROP TABLE IF EXISTS `committees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `committees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` varchar(45) NOT NULL,
  `position` varchar(45) NOT NULL,
  `name` varchar(300) NOT NULL,
  `positionRank` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `committeeClubUserId_idx` (`userId`),
  CONSTRAINT `committeeClubUserId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=85 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `committees`
--

LOCK TABLES `committees` WRITE;
/*!40000 ALTER TABLE `committees` DISABLE KEYS */;
INSERT INTO `committees` VALUES (83,'C00001','President','John Doe',1),(84,'C00001','Vice President','Kassim Samad',3);
/*!40000 ALTER TABLE `committees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `postId` varchar(300) NOT NULL,
  `participantId` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `eventPostId_idx` (`postId`),
  KEY `eventParticipantId_idx` (`participantId`),
  CONSTRAINT `eventParticipantId` FOREIGN KEY (`participantId`) REFERENCES `participants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `eventPostId` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=130 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (127,'20231126164539605_314','1111111111'),(128,'20231126221355248_255','1111111111'),(129,'20231126221437645_447','1111111111');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `follow_relations`
--

DROP TABLE IF EXISTS `follow_relations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `follow_relations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `followerUserId` varchar(45) DEFAULT NULL,
  `followedUserId` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `clubFollowedId_idx` (`followedUserId`),
  KEY `participantFollowerId_idx` (`followerUserId`),
  CONSTRAINT `clubFollowedId` FOREIGN KEY (`followedUserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `participantFollowerId` FOREIGN KEY (`followerUserId`) REFERENCES `participants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=655 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `follow_relations`
--

LOCK TABLES `follow_relations` WRITE;
/*!40000 ALTER TABLE `follow_relations` DISABLE KEYS */;
INSERT INTO `follow_relations` VALUES (652,'1111111111','C00001'),(653,'1111111111','C00003'),(654,'1111111111','C00007');
/*!40000 ALTER TABLE `follow_relations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `participantId` varchar(45) NOT NULL,
  `postId` varchar(300) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `postGetLikedId_idx` (`postId`),
  KEY `participantLikedId_idx` (`participantId`),
  CONSTRAINT `participantLikedId` FOREIGN KEY (`participantId`) REFERENCES `participants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `postGetLikedId` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=827 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
INSERT INTO `likes` VALUES (817,'1111111111','20231126221437645_447'),(818,'1111111111','20231127020842743_838'),(824,'1111111111','20231126164539605_314'),(826,'1111111111','20231126221355248_255');
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `participants`
--

DROP TABLE IF EXISTS `participants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `participants` (
  `id` varchar(45) NOT NULL,
  `password` varchar(300) NOT NULL,
  `email` varchar(300) NOT NULL,
  `name` varchar(300) NOT NULL,
  `profilePhoto` varchar(300) DEFAULT NULL,
  `role` varchar(45) NOT NULL,
  `phoneNumber` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `participants`
--

LOCK TABLES `participants` WRITE;
/*!40000 ALTER TABLE `participants` DISABLE KEYS */;
INSERT INTO `participants` VALUES ('1111111111','$2a$10$3KXVGdFseCcC17YUO7FIhe781uGTJSFpNs4NHojODvDmSvLW/IXa.','test@test.com','Guest User',NULL,'participant','+60111111111'),('1181102111','$2a$10$rpdJ5qQBWjDyQVHrPOWt8.hUTUrUqibgeQe/ZEuXWQbYfZIsJRpXK','test@test.com','Mak Cik Kau','','participant','+60111111111'),('1181102222','$2a$10$rpdJ5qQBWjDyQVHrPOWt8.hUTUrUqibgeQe/ZEuXWQbYfZIsJRpXK','test@test.com','John Doe','','participant','+60111111111'),('1181102333','$2a$10$rpdJ5qQBWjDyQVHrPOWt8.hUTUrUqibgeQe/ZEuXWQbYfZIsJRpXK','test@test.com','Ahmad Muhammad Samad','','participant','+60111111111'),('1181102444','$2a$10$rpdJ5qQBWjDyQVHrPOWt8.hUTUrUqibgeQe/ZEuXWQbYfZIsJRpXK','test@test.com','Steve Jobs','','participant','+60111111111'),('1181102555','$2a$10$rpdJ5qQBWjDyQVHrPOWt8.hUTUrUqibgeQe/ZEuXWQbYfZIsJRpXK','test@test.com','Pavilindra a/p Ramu','','participant','+60111111111'),('1181102666','$2a$10$rpdJ5qQBWjDyQVHrPOWt8.hUTUrUqibgeQe/ZEuXWQbYfZIsJRpXK','test@test.com','Richard Tan','','participant','+60111111111'),('1181102777','$2a$10$rpdJ5qQBWjDyQVHrPOWt8.hUTUrUqibgeQe/ZEuXWQbYfZIsJRpXK','test@test.com','Aminah binti Wahab','','participant','+60111111111'),('1181102888','$2a$10$rpdJ5qQBWjDyQVHrPOWt8.hUTUrUqibgeQe/ZEuXWQbYfZIsJRpXK','test@test.com','Ali bin Abu','','participant','+60111111111');
/*!40000 ALTER TABLE `participants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `id` varchar(300) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` varchar(5000) NOT NULL,
  `image` varchar(100) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `userId` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `userId_idx` (`userId`),
  CONSTRAINT `userId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES ('20231126164539605_314','IT Society New Member Day','Join us for IT Society New Member Day:\n\nDate: 13th September, 2023\nTime: 8pm - 10pm\nVenue: FCI CQCR2001\n\nWhat\'s in store for You?\n- Welcome new members\n- Discover faculty offerings\n- Networking opportunities\n\nWe\'ll also provide free food!\n\nDon\'t miss this event! ?','http://res.cloudinary.com/dvdz1zshx/image/upload/v1701017138/jcodswukfd0puuj0ilmg.png','2023-09-01 16:45:39','C00001'),('20231126172926998_102','CLS New Member Registration Week','多媒体大学（赛城）华文学会新会员登记周开跑啦 ?\n\n初来乍到的新生们是否对于大学生涯有所憧憬和期待？多媒体大学（赛城）华文学会不仅能让你体验丰富多彩的课外活动，更能充实你的大学生活！我们热烈欢迎你的加入，和我们一起展开新阶段的旅程吧 ?\n\n赶快点击下方的连接来加入我们吧 ??\nhttps://forms.gle/r95ereAxufdiLNGi9\n\n备注：\n1. 填写表格时，请使用多媒体大学学生电邮账号登入。\n2. 在籍会员无须填写此表格。\n\n若有任何疑问，请联络：\n郑凯文（+6011-29946989）\n黄心慈（+6017-8483673）\n杨鈊茼（+6017-3925821）\n\nChinese Language Society Multimedia University (Cyberjaya) New Member Registration Week has begun ?\n\nAre you a freshman who looks forward to university life? Chinese Language Society Multimedia University (Cyberjaya) will not only let you experience the splendid extracurricular activities, but will also enrich your university life! We welcome you to join us, let\'s begin a new journey together ?\n\nClick the link below to be a part of us ??\nhttps://forms.gle/r95ereAxufdiLNGi9\n\nRemarks:\n1. Please sign in with Multimedia University student email account when filling out the Google form.\n2. Existing members are not required to fill out this form.\n\nFor any inquiries, kindly contact:\nChang Kai Boon (+6011-29946989)\nWong Sim Zhi (+6017-8483673)\nNgo Xing Tung (+6017-3925821)','http://res.cloudinary.com/dvdz1zshx/image/upload/v1700990966/kn05xdyblw7p96doepjb.png','2021-04-26 17:29:26','C00002'),('20231126173027641_501','Online Orientation Night','号外号外！多媒体大学（赛城）华文学会新学期的线上迎新夜来啦！?\n\n偷偷告诉你们?本次的线上迎新夜将会是有史以来最独特的一次哦！这一次，我们会以不一样的方式来介绍本学会，让大家能够在了解本学会的同时，也能够让大家感觉到华文学会这个大家庭的温暖。希望大家都能够踊跃参与?\n\n✨线上迎新夜详情\n日期：2022年1月23日（星期日）\n时间：晚上8时正至晚上10时正\n平台：Google Meet\n报名表格：https://forms.gle/7ien1MkVfvY6JfXG6\n\n无论你是在籍会员或是新生，我们都非常欢迎你们的参与。也希望你们可以分享给你们的身边的朋友，一起度过这个愉快又精彩的夜晚?\n\n若有任何疑问，请联络：\n叶永隆（+6013-255 6509）\n卢沛勇（+6018-761 8422）\n张乙娴（+6010-232 0328）\n\nAttention! Chinese Language Society Multimedia University (Cyberjaya) Online Orientation Night for the new trimester is coming!?\n\nThis online orientation night will be the most unique one ever! We\'ll be introducing Chinese Language Society in a different way so that you can get to know our society and feel the warmth of the Chinese Language Society at the same time. We hope everyone can participate in this event?\n\n✨Online Orientation Night Details\nDate : 23 January 2022 (Sunday)\nTime : 8pm - 10pm\nPlatform: Google Meet\nRegistration Form: https://forms.gle/7ien1MkVfvY6JfXG6\n\nWhether you\'re an existing member or a freshman, we welcome you to join us. We also hope that you\'ll share this with your friends and let\'s have a fun and exciting night together ?\n\nFor any inquiries, kindly contact:\nYap Yong Loong (+6013-255 6509)\nLo Pei Yong (+6018-761 8422)\nTeoh Ye Zhian (+6010-232 0328)','http://res.cloudinary.com/dvdz1zshx/image/upload/v1700991027/zk60d6lfqo7rcj0zswho.png','2022-01-01 17:30:27','C00002'),('20231126173129007_417','Chinese Language Society Multimedia University (Cyberjaya) Training Camp','多媒体大学（赛城）华文学会干部培训营是学会一年一度举办的常年活动之一。经过了两年的疫情，学会活动终于开始正式回归线下模式，包括此次培训营！举办此培训营的目的是为了让会员们通过各种模式，了解与认识学会的运作，以及提升领导能力、团队精神、沟通能力等等。因此，营委们在此正式邀请所有会员参与此次培训营，相信您的参与能够为此次培训营多添一份色彩！✨\n\nThe Chinese Language Society Multimedia University (Cyberjaya) Training Camp is an annual activity of the society. After two years of pandemic, the society\'s activities are finally starting to revert back to offline mode which includes this training camp! The purpose of this camp is to improve the society members understanding regarding the operations of the society and to promotes leadership, teamwork, communication skills and more through various modes. Therefore, the camp committee would like to formally invite all members to participate in this camp and we believe that your participation will help make this camp even more exciting!✨\n\n报名截止日期 Registration Deadline : 10/6/2022 （星期五 Friday）\n\n日期 Date : 25/6/2022 – 26/6/2022 （星期六至星期日 Saturday till Sunday）（两天一夜 Two Days One Night）\n\n地点 Venue : 多媒体大学（赛城）校园 Multimedia University (Cyberjaya) Campus\n\n营费 Camp Fee : RM 25\n\n报名链接 Registration Link : https://forms.gle/FAMgasYWKHvw1u5e8\n\n集合地点 Gathering Point : FCI Theatre CQMX 0001 (8.45 a.m. , 25/6/2022)\n\n欲知更多详情，请联络 For any inquires, please contact ：\n\n张乙娴 Teoh Ye Zhian +6010-232 0328\n陈泰宇 Tan Tai Yu +6019-591 4003','http://res.cloudinary.com/dvdz1zshx/image/upload/v1700991088/gjgv1696mqjhmwwbubrn.png','2022-06-01 17:31:29','C00002'),('20231126180354815_391','IU Outing - Back to Nature','Naik beca sampai senja,\nBalik rumah masak gulai,\nPenat belajar penat bekerja,\nJom mandi sungai?️!\n\nIU kembali dengan aktiviti menarik untuk anda semua! Program kali ini membawa anda semua ke sungai untuk mengeratkan hubungan sesama ahli IU disamping merehatkan diri dalam suasana nyaman alam sekitar?\n\n? Butiran program adalah seperti berikut:\nTarikh: 5 March 2022 (Sabtu)\nMasa: 8.30 am - 4.00 pm\nLokasi: Sungai Congkak, Hulu Langat\nBayaran: RM10\n\nMenarik betul! Jika anda teruja untuk mengikuti program kami, anda boleh mengisi borang penyertaan yang terdapat dalam butiran group Whatsapp \'Keluarga IU\' dengan segera?\n\nSebarang pertanyaan boleh hubungi:\nIrfan - 01141931192\nYusri - 0195682580','http://res.cloudinary.com/dvdz1zshx/image/upload/v1700993034/dihpp4oa2usth0hcqqto.png','2022-02-15 18:03:54','C00004'),('20231126180432503_997','Talk - Pendidikan dalam Al-Quran','Pendidikan merupakan asas kepada pembentukan akal yang mempengaruhi perubahan tingkah laku seseorang. Pendidikan hadir dalam pelbagai bentuk. Al-Quran merupakan salah satu sumber ilmu utama bagi kita sebagai umat Islam.\n\nBersama IU, bersama kita sertai\n\n? Tajuk: Pendidikan dalam Al-Quran ?\n?‍♂️ Penceramah: Ustaz Noh\n? Tarikh: 9 Oktober 2021\n⏰ Masa: 12:00 - 1:00 p.m.\n? Platform: Youtube Institusi Usrah MMU Cyberjaya\n\nDengan ini, Institusi Usrah ingin menjemput anda semua untuk segera mendaftarkan diri anda dengan segera. Klik Link ini https://youtu.be/hbl18gf6j6o untuk ke YouTube. Link turut didapati dalam linktr.ee di bio.\n\n#IUCyber\n#WeShareBecauseWeCare\n#UpholdingTheFamilyhood','http://res.cloudinary.com/dvdz1zshx/image/upload/v1700993072/qdan07cwhnkrkni6pcey.png','2021-09-15 18:04:32','C00004'),('20231126180800561_612','Kursus Pra-Perkahwinan 2022','Assalamualaikum, semua! Semoga hari anda baik-baik sahaja✨\n\n? Kursus Pra-Perkahwinan telah kembali! ?\n\nKami dari Institusi Usrah dengan kolaborasi bersama Unit Keagamaan dan sTyLe akan mengadakan Kursus Pra-Perkahwinan kepada mereka yang ingin membuat persediaan perkahwinan pada masa terdekat atau yang akan datang. Jadi, apa lagi? Jomlah turut serta!\nAmbillah peluang keemasan ini untuk sertai kursus ini dengan harga yang lebih murah! ???\n\n?Maklumat program adalah seperti berikut:?\n?️Tarikh: *22-23 Oktober 2022*\n?Tempat: *FOM CRCX0001*\n?Yuran: Pelajar MMU: *RM50*\nAlumni & Staf MMU: *RM60*\n\n*Anda akan diberi:*\n➡️Sijil Kursus Pra-Perkahwinan yang diiktiraf oleh JAIS (Seumur hidup)\n➡️ Sarapan, makan tengahari, dan minum petang\n\n*Link pendaftaran ⬇*\nhttps://forms.gle/AiEUSRDx8gYu77JK9\n*Tarikh tutup pendaftaran pada 19 Oktober 2022*\n\nSebarang persoalan boleh ditujukan kepada\n?? Amierul - 010 831 1857\n?? Syamil - 011 1140 8532\n\nCara pembayaran akan diberikan di dalam form\n\nJumpa di program!?','http://res.cloudinary.com/dvdz1zshx/image/upload/v1700993279/xw36gnpk2ssuroz7gxhw.png','2022-09-25 18:08:00','C00004'),('20231126181322880_279','Jamuan Raya IU','Assalamualaikum wbt semua❣️\nBersempena dengan Sambutan Hari Raya Aidilfitri, kami daripada pihak IU ingin menjemput kesemua ahli Kelab Institusi Usrah untuk menghadiri Jamuan Raya IU ?\n\nPelbagai juadah raya istimewa dan aktiviti menarik bakal menanti anda! Marilah sertai kami dalam memeriahkan lagi majlis ini kerana kehadiran anda sangat dialu-alukan oleh kami semua?\n\nButiran program adalah seperti berikut:-\n? Tarikh : Sabtu, 11 Jun 2022\n⏳ Masa : 8.00 PM - 11.00 PM\n?Tempat: Multipurpose Hall (MPH) MMU\n\nPendaftaran adalah percuma‼️\nDaftar segera kerana pendaftaran adalah terhad!\n\n? Link pendaftaran:-\nhttps://forms.gle/WowPN4fdzMamhfXQ9\n\nUntuk sebarang pertanyaan, boleh hubungi:\nNurin Aida 019-3391552\nIrfan 011-41931192\n\n#jamuanrayaIU #IUCyber #WeShareBecauseWeCare #upholdingthefamilyhood','http://res.cloudinary.com/dvdz1zshx/image/upload/v1700993602/bu3necbpgspoem6ahkx2.png','2022-05-25 18:13:22','C00004'),('20231126214455440_723','SCPH Raya Gathering 2023 CYB x MLK','Assalamualaikum & Salam 1 Suara 1 Hati\n\nKami SCPHMMU Cyberjaya, menjemput anda ke SCPH Raya Gathering 2023 CYB x MLK pada:\n\n? 21 Mei, 2023 (Ahad)\n⏰ 10:00AM-6:30PM\n? FCI Atrium, MMU Cyberjaya\n? Baju Raya (pagi), Baju Latihan (petang)\n\nPelbagai aktiviti menarik!\nCabutan Bertuah, Pertandingan Baju Raya Tercantik, Talent Show, Fitness Challenge dan macam-macam lagi!\n\nPengesahan Kehadiran melalui \"RSVP\"\n\nhttps://forms.gle/vvmSy8UyyBddSnbM7\n\nSemoga dengan kehadiran anda dapat menyeri dan memeriahkan lagi majlis ini!\n\n#raya2023 #SCPHRAYA','http://res.cloudinary.com/dvdz1zshx/image/upload/v1701006294/m8ghxwddi1l0sj5fpxeg.png','2023-05-01 21:44:55','C00005'),('20231126214527208_138','Freshies Bonding Night','Assalamualaikum & apa khabar semua!!?✌??\n\nSCPHMMU ingin menjemput anda semua ke Freshies Bonding Night ?\n.\n.\nSesi suai kenal dan mini games akan dijalankan. Anda juga berpeluang untuk memenangi hadiah menarik!\n.\n.\nPihak SCPHMMU juga akan membuka peluang kepada mereka yang mempunyai persoalan dan ingin tahu lebih lanjut tentang keistimewaan Silat Cekak Pusaka Hanafi.\n.\n.\nSee you guys there!!!!\nTarikh: 3 September 2021 (Jumaat)\nMasa: 9:00PM-10:30PM\nTempat: Google Meet\n*GM link akan diletakkan dia bio pada hari Jumaat?\n\n#silatcekakpusakahanafi #pusakahanafimmucyberjaya #mmugoforit','http://res.cloudinary.com/dvdz1zshx/image/upload/v1701006326/glunelybbulekgtmrcun.png','2021-09-26 21:45:27','C00005'),('20231126214616257_331','Malam Suai Kenal Silat Cekak Pusaka Hanafi','Assalamualaikum semua ☺️ kami dari Silat Cekak Pusaka Hanafi MMU Cyberjaya ingin menjemput anda semua ke Malam Suai Kenal Silat Cekak Pusaka Hanafi.\n\nSesi ini bertujuan untuk membuka peluang kepada mereka yang mempunyai persoalan dan ingin tahu lebih lanjut tentang Silat Cekak Pusaka Hanafi.\n\nButiran Program:\nTarikh: 14 November 2022 (Isnin)\nMasa: 9.15PM-11.00PM\nTempat: Kelas FOE CLCR1026\n\nJemput semua kawan-kawan datang sekali! Jumpa anda di sana ?','http://res.cloudinary.com/dvdz1zshx/image/upload/v1701006375/kkwrxmrwudjvte4mteqd.png','2022-11-01 21:46:16','C00005'),('20231126214700195_253','Mesyuarat Agung Tahunan SCPH 2022/2023','Salam 1 Suara 1 Hati ?\n\nSukacita dimaklumkan bahawa Silat Cekak Pusaka Hanafi MMU Cyberjaya akan mengadakan Mesyuarat Agung Tahunan 2022/2023 bagi penyerahan kuasa kepada kepimpinan baharu. Butiran program adalah seperti berikut:\n\nTarikh: 13 Disember 2022 (Selasa)\nMasa: 9.00pm- 11.30pm\nTempat: CNMX1005\nPakaian: Smart Casual\n\nDijemput para ahli Pusaka Hanafi MMU Cyberjaya, pelajar dan alumni untuk turun padang bagi memeriahkan program.','http://res.cloudinary.com/dvdz1zshx/image/upload/v1701006419/xfbvobqmzgu6sfqeeag9.png','2022-11-26 21:47:00','C00005'),('20231126220152787_507','Match Day - MMU FC and UKM FC','All eyes for today’s big clash between MMU FC and UKM FC ?\n\nSee you soon!\n\n#mmufccyber\n#kronos\n#sportsparagon','http://res.cloudinary.com/dvdz1zshx/image/upload/v1701007311/mypcbsbwabeiszvey2y0.png','2023-02-10 22:01:52','C00006'),('20231126220348394_221','Match Day - MMU FC and UITM Pahang FC','All set for our final Liga Bola Sepak IPT D1 match against Uitm Pahang FC tomorrow ??\n\nFighting to finish the season strong ??⚔️\n\n#mmufccyber\n#kronos\n#sportsparagon','http://res.cloudinary.com/dvdz1zshx/image/upload/v1701007427/wlj4v5hhzllf8jo3ah37.png','2023-02-20 22:03:48','C00006'),('20231126220423740_591','Match Day - MMU FC and UNISZA','Match Day Ready! Bring on UniSZA ???\n\n#mmufccyber\n#kronos\n#sportsparagon','http://res.cloudinary.com/dvdz1zshx/image/upload/v1701007462/vgcvyuv9nssfbsysv8q5.png','2023-01-15 22:04:23','C00006'),('20231126221355248_255','Beach Day 2.0','Assalamualaikum and a very good day, dear students!!! ✨\n\nSekretariat Sekolah@MMU is back with a fascinating ice-breaking event!\nDo you feel absorbed and drained after weeks-long of studying and taking exams? Don\'t worry because we got your back, brothers and sisters!! ?\n\nLet\'s join us in our two-days-one-night \'healing\' escapade to the beaches in Melaka ?\nSome interesting activities are waiting to be enjoyed there. And rest easy, we also provide accommodation and transportation at our destination ?️\n\nBe reminded to bring along your appropriate clothes going there ?\n\nHere are our event details :\n\n? : RM25 (members), RM30 (non-members)\n?️ : 26 - 27 February 2023\n⏲️ : Two days and one night\n?: Melaka\n\nSeats are limited so the first to come, is the first to be served! See you guys soon!! ✨\n\nYou can register via this link : bit.ly/40aZUZy','http://res.cloudinary.com/dvdz1zshx/image/upload/v1701008034/gerdooihzszlak2v2igt.png','2023-02-15 22:13:55','C00007'),('20231126221437645_447','Fun Futsal 2022 Competition','‼️✨ SEKOLAHMMU IS BACK ✨‼️\n\nAssalamualaikum and good day everyone !!?\nWe would like to invite everyone to our Fun Futsal 2022 Competition ⚽️?\nAre you enthusiastic about sportsmanship? Do you have incredible futsal striking abilities? Come show us your skills in Fun Futsal 2022!\nYou\'re in for a treat!??\n\n?️ Date: 5-6 November\n⏰Time: 10.30 a.m\n? Location : IOI Sports Centre\n\n? open to all male students, male alumni, and male staff of Multimedia University only\n? slots for alumni and staff are limited\n(More details is provided in the Google form)\n\nRegister at our bio now ??\nAny inquiries, please do contact:\n☎️ Luqman - 0109001440\n☎️ Ajwad - 01154261979','http://res.cloudinary.com/dvdz1zshx/image/upload/v1701008076/b21eqangahdtnq90ltq5.png','2022-10-15 22:14:37','C00007'),('20231126221524133_451','Sekolah@MMU - Penang Treats','Let\'s take a short break from all the stress and join Sekretariat Sekolah@MMU for a short weekend getaway trip to Penang!?','http://res.cloudinary.com/dvdz1zshx/image/upload/v1701008123/r01ia4sdc4vd2ie7lhls.png','2022-07-01 22:15:24','C00007'),('20231126221612683_122','Sekolah@MMU Club Registration','CAMPUS REBOOT CARNIVAL IS HAPPENING NOW!\n\nCome meet us in front of Multipurpose Hall and register as a member now! Looking forward to meet everyone ?','http://res.cloudinary.com/dvdz1zshx/image/upload/v1701008171/jupp7onobtuiaaxbyuqt.png','2022-01-15 22:16:12','C00007'),('20231126222449871_455','KPMG x SRM Online Talk','Students around the world regardless of their origins all carry the same responsibilities, such as attending classes on time and completing assignments regularly. Although these are fundamental responsibilities of an average student, to excel in all aspects, students have to be socially responsible too! \n\nIn fact, corporations today are more attracted towards hiring socially responsible students that participate and volunteer in events that positively impact communities! Socially responsible students have many advantages such as a higher mastery of their soft skills and work ethic. Want to learn more about the why\'s and how\'s of being a socially responsible student? \n\nBe sure to follow us and tune in our live on the 18th August 2022, 8pm onwards.','http://res.cloudinary.com/dvdz1zshx/image/upload/v1701008688/mtpxbkfnbleumkf5qbrv.png','2022-08-01 22:24:49','C00008'),('20231126222703154_586','Berkelah Bersama SRM','BERKELAH BERSAMA SRM?\n\nJom picnic with SRM ??\nWe have foodS, games (ada prizes and lucky draw jugak tau?) and a small sharing session to create a stronger bond among us ?\n\nDetails of the event is as below:\n? Date: 26th March 2022 (Saturday)\n⏰ Time: 3.00-5.30pm\n? Place: MMU Lake\n\nBut❗❗we have limited seats, so first _register_ first serve, Fill in the form now at the link in bio!! Open to all SRM members only ?\n\nAny questions can ask +60 12-786 6875 (Irfan)','http://res.cloudinary.com/dvdz1zshx/image/upload/v1701008822/x8gyzysfemamslpzpoax.png','2022-03-01 22:27:03','C00008'),('20231126222759386_895','SRM - ZOOM Pahang','\nAsalammualaikum warga MMU! Anda semua dah lihat \'teaser\' tentang ZOOM tahun ini? Mesti ramai yang berminat untuk menyertai program ini! Sepertimana yang telah kita tahu, ZOOM adalah program tahunan dianjurkan oleh SRM ? tetapi malangnya, disebabkan Covid-19, sudah dua tahun kami tidak mengadakan program ini! Jadi janganlah lepaskan peluang ini ?\n\nNanti dahulu! kepada yang berminat untuk menyertai program ini, temuduga fizikal akan diadakan, dan terbuka untuk seluruh pelajar MMU!\n\nTarikh: 13-14 Jun 2022\nMasa: 8-10 PM\nLokasi: FOE\n\nhttps://forms.gle/L2WQcxpi3jJbU8Dt6\nSila isi google form untuk menempah slot temuduga anda! Kita jumpa di sana! ?\nKami berharap agar ZOOM tahun ini akan mendapat sambutan yang hangat daripada anda semua ! ❤️','http://res.cloudinary.com/dvdz1zshx/image/upload/v1701008878/hfjmyozvkwqeezzcnb4e.png','2022-06-01 22:27:59','C00008'),('20231127020842743_838','CodeNection 2022','⏰ Tick-Tock, the time you’ve been waiting for has finally arrived - Registration for CodeNection 2022 is open!! ??\n\n?Have you been wanting to challenge and sharpen your technical and programming skills? Have you been looking for a platform that gives you a chance to compete with other young programmers? CodeNection has got you covered ? Codenection is a national-scale programming-focused event which includes a hackathon, a competitive programming event and a series of workshops ?This event is a whole package for all young IT enthusiasts.\nFeeling excited yet? What are you waiting for? Register now by scanning the QR code above and be prepared for this amazing event. We can’t wait to see you there! ???\n\n? Registration Period: 8th October 2022 - 28th October 2022\n\nEvent Details:\n?Date: 28th October - 27th November 2022\n?Completely FREE of charge\n?Include Hackathon Kits (T&C Apply.)\n\n? Register via CodeNection Official Website: https://www.itscodenection.com/\n\nCodeNection Facebook: https://www.facebook.com/CodeNection/\nCodeNection Website: https://www.itscodenection.com/\n\n-----------------------------------------------\n#cn2022 #codenection\n#competitiveprogramming #hackathon','http://res.cloudinary.com/dvdz1zshx/image/upload/v1701050921/dzreiv7paofprevxdtfz.png','2022-10-01 02:08:42','C00001'),('20231127021036656_911','BarCamp Cyberjaya 2021','Join us while we talk about all sorts of interesting topics! Registration are still open, please register yourself to the event by clicking this link ? https://barcampcyberjaya.org/login.\n\nHope to see you all on the 2nd of Oct ? 10.00am to 4.00pm ⏰ on Gather.Town.\n\nRegister to ? BarCamp Cyberjaya 2021 by logging into our online portal ➡️ https://barcampcyberjaya.org/login\n\n---\nDate: 2nd October 2021\nTime: 10.00 am - 4.00 pm\nOfficial Website: https://barcampcyberjaya.org/login\nJoin our discord server: https://discord.gg/CbweF2UmQt\nPlatform: https://www.gather.town/\nPromotional Video: https://www.youtube.com/watch?v=V4yuHoLQpck\n\n#barcampcyberjaya2021 #barcamp #unconference','http://res.cloudinary.com/dvdz1zshx/image/upload/v1701051034/pum2kpshr4aduxwda2wd.png','2022-09-26 02:10:36','C00001'),('20231127021317050_598','MMU Hack 2022','Ladies and Gentlemen! MMU Hack 2022 is back and open for registration now! ?\n\nMMU Hack is a programming competition that has the main purpose of introducing the concept of competitive programming to MMU students as well as increasing their programming skills. Register now to grab this opportunity to gather more knowledge, gain experience and also have fun in taking part in our competitive programming event with your friends! ✨ But that\'s not all! We will also be hosting a \"Competitive Programming\" workshop before the competition for all the participants to prepare them better for the competition. The registration fee for this event is entirely FREE so what are you waiting for? Click on the registration form below or visit our official MMU Hack 2022 website to learn more about our event! ?\n\nRegistration Period: 27th April 2022 - 5th May 2022 (11:59 am)\n\nEvent Details:\nDate: 7th May 2022 (Saturday)\nTime: 10:00 AM - 5:30 PM\nPlatforms: Google Meet & HackerRank\nRegistration Link: https://forms.gle/E2VyhWutnaAW9Ppu6\nMMU Hack 2022 Website: https://mmuhack.itsociety.rocks/','http://res.cloudinary.com/dvdz1zshx/image/upload/v1701051195/ova7vvewppa8sxf8wyyu.png','2022-04-26 02:13:17','C00001'),('20231127021338276_375','Tech Career Days 2022','The time is nigh! ? Tech Career Days 2022 ? is rapidly approaching, so mark your calendars! ???\n\nAs an IT student/graduate looking to explore the endless possibilities of the IT field ? do not miss this opportunity to meet incredible representatives ?‍? from IT companies gathering in this event! Bundled along with exciting prizes ? and insightful talks and discussions ? as well as the chance to interact with employers ? this event serves as a gold mine for all upcoming IT graduates! ???\n\nSo? What are you waiting for? Scan the QR Code above and lock your spot and submit your resumes now! See you there! ?\n\nDate : 16th - 17th March 2022\nTime : 10:00am - 5:00pm\nWebsite: https://techcareerdays.com\nVenue: Google Meet & Discord\nAdmission Fees: FREE\n#tcd2022 #techcareerdays2022 #itstcd2022 #mmu #itjobs #jobsvacancy ​#malaysia ​#jobsinmalaysia','http://res.cloudinary.com/dvdz1zshx/image/upload/v1701051217/yecrxqliipjzzkjutn2r.png','2022-02-26 02:13:38','C00001'),('20231127021412022_945','Backend API Workshop 2021','Javascript is one of those tools ? or knowledge that you’ll need to make dynamic websites, applications and all sorts of things.\n\nGuess what? ?? ??????? ????????? ???? is going to host a javascript based workshop named “Backend API Workshop 2021” ?, where we’ll talk about javascript alongside with an addition - “Node.js”. In the workshop itself, we’ll introduce javascript fundamentals and also we’ll be making a fully functional API written in Node.Js!\n\nRegistration starts now at (? https://forms.gle/jj2hzYKkPsb4xwYS6), you can also scan the qr code in the poster below! Stay tuned to IT Society MMU Cyberjaya as we’ll be having many exciting events coming up! See you there! ?\n\n- Session 1\nDate: 16 October 2021 (Saturday)\nTime: 2pm to 4pm\n\n- Session 2\nDate: 17 October 2021 (Sunday)\nTime: 2pm to 5pm\n\nPlatform: Google Meet\n\n#javascript\n#workshop\n#itsWorkshop\n#nodejs','http://res.cloudinary.com/dvdz1zshx/image/upload/v1701051250/jijigbodam99uvdtpomj.png','2021-10-21 02:14:12','C00001'),('20231127021746672_672','Intro to Rock Climbing','Attention to all the thrill seekers out there, OARS Club is organising an Intro to Rock Climbing ??‍♂️once more to the ones who are up for that adrenaline rush again and for the ones who missed our event last time. Don\'t miss out this chance as it\'s not easy to come by , as we will also be camping at the site for a night? ! We will teach you guys all the basics for rock climbing so worry not if you don\'t have any experience. We can\'t wait to see you guys there and will make sure you guys enjoy it as much as we do! ⁣\n.⁣\n?Registration link is in our bio⁣\n.⁣\n? 14th to 15th December⁣\n? Gua Damai Extreme Park⁣\n.⁣\n?Tentative⁣\n*Saturday (14 December 2019 )*⁣\n08.00am- Gather at SRM⁣\n09.00am- Depart from SRM⁣\n10.00am- Arrive at Gua Damai Extreme Park⁣\n10.30am- Safety Briefing⁣\n11.00am- Start Climbing⁣\n01.30pm- Lunch⁣\n02.30pm- Continue Climbing⁣\n06.00pm- Cool Down⁣\n08.00pm- Dinner⁣\n09.00pm- Sharing Session⁣\n10.30pm- Sleep⁣\n.⁣\n*Sunday (15 December 2019)*⁣\n08.00am- OARS Cergas⁣\n09.00am- Breakfast⁣\n10.00am- Start Climbing⁣\n01.30pm- Lunch⁣\n02.30pm- Pack Up⁣\n03.30pm- Depart to MMU⁣\n.⁣\nPayment detail is as follows:-⁣\n?Member -RM45⁣\n?Non member - RM55⁣\n?Non MMU -RM65⁣\n⁣\n❗?❗Deposit -RM25 ⁣\n.⁣\nPayment can be made too:-⁣\n7070816753 ( CIMB )⁣\nCynthia Emylda anak Buniface⁣\n.⁣\nSeats are limited so be sure to secure them quick by paying the deposit⁣\n❗Seats are based on a first come first serve ⁣\n❗Deposits are non-refundable\n\n#PowerToTheOars #BornToBeTough #TrainToBeRough\n','http://res.cloudinary.com/dvdz1zshx/image/upload/v1701051465/yaho6uhglknxcyha0nw5.png','2019-11-11 02:17:46','C00003'),('20231127022145135_251','OARS 101 - All About Outdoors','Good day, everyone! ?? \n\nWe hope that the semester is going well for all of you ☺️ We have some exciting news to share with all of you, an OARS EVENT!\nWe will be hosting a relaxed online sharing session where  students can have an opportunity to learn about OARS and its activities such as; climbing, mountaineering, water sports, and leisure. We\'ll be inviting alumni who have participated and/or hosted events at an international level.\n\nDetails as below ??\n?Date: 23/10/2021 (Saturday) \n⏰Time: 10:30am-12:00pm\n?Venue: Google Meet \n?Registration Link :\nhttps://docs.google.com\n?Google Meet : \nhttps://meet.google.com/rzv-ynan-biq\n\nAnd did we mention, there will be plenty of outdoor gears to be won throughout the event. So dont miss this chance to come and have fun with us while learning all about OARS. ?✨','http://res.cloudinary.com/dvdz1zshx/image/upload/v1701051703/kqxhsbieqq7xfttb5wow.png','2021-10-01 02:21:45','C00003'),('20231127022235901_983','Day Hike to Gunung Angsi','Hello, Everyone! OARS is back yet again with our second event of the semester, \"Day Hike to Gunung Angsi\". If you\'re someone who loves hiking, then this event is definitely for you! Don\'t miss out on this chance to join us on this hike! Don\'t worry if you don\'t have experience in hiking as we will teach you all the basics of hiking.\n\n? Registration link\nhttps://forms.gle/gzfWGqSxnxDiayod6\n\n? 5 March 2022 (Saturday)\n? Gunung Angsi, Negeri Sembilan\n\n? Tentative\nSaturday (5 March 2022)\n12.00 am - Gather at SRM/OARS Clubroom\n3.00 am - Depart from SRM/OARS Clubroom\n4.00 am - Reach R&R Seremban, Eat breakfast\n~ (Subuh prayers, Light breakfast will be provided)\n6.30 am - Arrive at Bukit Putus\n7.00 am - Reach Bukit Putus Trailhead (Gather at carpark)\n7.10 am - Briefing\n7.30 am - Start hiking\n10.30 am - Reach to the peak of Gunung Angsi\n11.00 am - Free & Easy\n11.15 am - Descent to Ulu Bendul\n12.30 pm - Gather at carpark and wait for bus to arrive\n1.00 pm - Depart to MMU\n4.00 pm - Arrive at MMU\n\nPayment detail is as follow:\n?OARS member: RM 25\n?Non-member: RM 30\n‼️?‼️ Deposit: RM 15\n\nPayment can be made to ??\n168603146673 (MAYBANK)\nMaryam shahidah binti mohd fauzi\n\n‼️Secure your seats by paying the deposit as the seats are limited ?\n‼️We go by \'first come, first serve\' basis ??\n‼️ Deposits are not refundable\n\nFor more information, contact ??\nVidhya- 012-3270904\nAmalia- 019-445 5867\n\n#PowerToTheOars #BornToBeTough #TrainToBeRough\n','http://res.cloudinary.com/dvdz1zshx/image/upload/v1701051754/fmiwjxaby4gc7cpv9fnx.png','2022-02-15 02:22:35','C00003'),('20231127022254660_459','Rowing Simulator Competition','Hi everyone! OARS and Club Fitness Cyberjaya will be collaborating during the Convo Fest to present to you guys our Rowing Competition. ?‍♂️?‍♀️\n\nBe sure to look out for our booth during the convo fest this weekend. If you think u can row the furthest in a short amount of time then come and test yourself!??\n\nCome and participate to test out your fitness aswell and win some prizes ?\n\nCategory 1: Men\nCategory 2: Women\n\nLocation: Infront of lecture hall CNMX1005 (beside the main stage)\nTime: 3:30-7:00pm\nDate: 12th-13th March 2022\nRegistration: On the spot','http://res.cloudinary.com/dvdz1zshx/image/upload/v1701051773/jexuvpyn99qwxcygnq4h.png','2022-02-20 02:22:54','C00003'),('20231207075750287_750','Charity By The Beach','Assalamualaikum and a very good day to everyone! ?\n\nWe need YOU, yes you, to join us together in our fun event, Charity By The Beach!! ?\nThanks to SRM special collab with BKSPK, you get a chance to be a volunteer for this event to help out single mothers as well as of course, gain a new experience from activities by the beach~ ?\n\nDate : 19th June 2022\nVenue : Pantai Kelanang, Banting\nTime : 8AM - 6PM\n✨food, bus, certificates are PROVIDED✨\n\nHurry up and scan the qr code, or fill in the form using the link below to join! Only 25 spots are available exclusively for SRM members only ?\n\nhttps://docs.google.com/forms/d/e/1FAIpQLSdyYOVbCsJq8tjq4NJ43ld37vlspJmSINNE2ZsWW3Nkc1B8gA/viewform','http://res.cloudinary.com/dvdz1zshx/image/upload/v1701935868/d7zsorsttwxg9qpsc7fw.png','2023-12-07 07:57:50','C00008');
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(45) NOT NULL,
  `password` varchar(300) NOT NULL,
  `email` varchar(300) NOT NULL,
  `name` varchar(300) NOT NULL,
  `profilePhoto` varchar(300) DEFAULT NULL,
  `bio` varchar(300) DEFAULT NULL,
  `role` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('C00000','$2a$10$kdCecR8dmaqL1k3riPd3a.F6fG.GJ9cLBTBkK9QsAKpeKznYXs/yW','test@test.com','Club Guest',NULL,'','club'),('C00001','$2a$10$byBpYkYsQYbbkgpRiZSa3ucZQqdFqxnYShrbfI4hIr6CjfbWJr/fO','test@test.com','IT Society MMU Cyberjaya','http://res.cloudinary.com/dvdz1zshx/image/upload/v1700990220/bkisefaomgj6qocgcces.jpg','Faculty-based club of Faculty of Computing & Informatics by MMU Cyberjaya Students','club'),('C00002','$2a$10$kwZoBQZfM.rVG8/DnQ1.TeyyFG.B8sOSbL/nbLlnAilvEBAwsXnt2','test@test.com','Chinese Language Society MMU Cyberjaya','http://res.cloudinary.com/dvdz1zshx/image/upload/v1700990872/naxqbwfds8dmvwa8i3qy.jpg','Chinese Language Society in Multimedia University, Cyberjaya.','club'),('C00003','$2a$10$cARTBIBJU0Q7jYfJhvLXP.Bw8.cBoNhSdu0ESy3KeH.nm0hbVyR8S','test@test.com','OARS MMU Cyberjaya','http://res.cloudinary.com/dvdz1zshx/image/upload/v1700991371/ondxjapetizc2wlbq4bk.jpg','Outdoor Activities & Recreational Society (OARS) MMU Cyberjaya\nEst. 2000\n','club'),('C00004','$2a$10$q5V7SB8kBAQe4jxH/xhFMOXmW1vQ12o8MEsCAXOyqYEvF9xQXsI7y','test@test.com','Institusi Usrah (IU) MMU Cyberjaya','http://res.cloudinary.com/dvdz1zshx/image/upload/v1700992784/wumd6xm1liwt0nulftjl.jpg','Akademik Kepimpinan Akhlak Dakwah.\n#WeShareBecauseWeCare\n#UpholdingTheFamilyhood','club'),('C00005','$2a$10$gmXvE8NmmeHz8RDa3I3bJ.4N9l6Gz2uleta7cPls.B9NbdzIPm7ve','test@test.com','Silat Cekak Pusaka Hanafi MMU Cyberjaya','http://res.cloudinary.com/dvdz1zshx/image/upload/v1701006159/xquhvckumg7jf3vpwhrc.jpg','?\"World Record Holder\" as The Largest Silat Lesson\n? YM Sheikh Dr Hj Md Radzi Hj Hanafi\n#satusuarasatuhati #pusakahanafimmucyberjaya','club'),('C00006','$2a$10$hzqR3X.C9ChJ6KD6BLCXpO/mgj.s30mqwPyGGEvnHMSH.p0SV0idy','test@test.com','Multimedia University FC','http://res.cloudinary.com/dvdz1zshx/image/upload/v1701007139/ra8jljm1imjfujo39sbc.jpg','Official Multimedia University Football Club','club'),('C00007','$2a$10$Y/xPPDpcGphMvFUmcwEuz.Tf8mU8nUtZjNMOMuDLj.P18hau8Qkum','test@test.com','Sekretariat Sekolah@MMU','http://res.cloudinary.com/dvdz1zshx/image/upload/v1701007789/xuzxvsq0ckaxwblt0lem.jpg','Volunteerism organization that focuses on skills needed in Digital Technology, Entrepreneurship, and Digital Innovation.','club'),('C00008','$2a$10$RSqRgiJI9alNntRoTeLYp.S.NhwJrHMZTUKrrX1fvqKBrq1f1JLAa','test@test.com','SRM MMU Cyberjaya','http://res.cloudinary.com/dvdz1zshx/image/upload/v1701008398/j3ut5osgjoszn2ezhanh.jpg','Sekreteriat Rakan Muda','club');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-08 15:51:43
