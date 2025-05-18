/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.11-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: JDSfr
-- ------------------------------------------------------
-- Server version	10.11.11-MariaDB-0ubuntu0.24.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Artiste`
--

DROP TABLE IF EXISTS `Artiste`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Artiste` (
  `ArtistID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  PRIMARY KEY (`ArtistID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Artiste`
--

LOCK TABLES `Artiste` WRITE;
/*!40000 ALTER TABLE `Artiste` DISABLE KEYS */;
INSERT INTO `Artiste` VALUES
(1,'Josh Cappel'),
(2,'Doris Matthäus'),
(3,'Volkan Baga'),
(4,'Dimitri Chappuis'),
(5,'Matthias Catrein'),
(6,'Cyrille Daujean'),
(7,'Stéphane Gantiez'),
(8,'Isaac Fryxelius'),
(9,'Klemens Franz'),
(10,'Miguel Coimbra');
/*!40000 ALTER TABLE `Artiste` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ArtisteJeu`
--

DROP TABLE IF EXISTS `ArtisteJeu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `ArtisteJeu` (
  `JeuID` int(11) NOT NULL,
  `ArtistID` int(11) NOT NULL,
  PRIMARY KEY (`JeuID`,`ArtistID`),
  KEY `ArtistID` (`ArtistID`),
  CONSTRAINT `ArtisteJeu_ibfk_1` FOREIGN KEY (`JeuID`) REFERENCES `Jeu` (`JeuID`),
  CONSTRAINT `ArtisteJeu_ibfk_2` FOREIGN KEY (`ArtistID`) REFERENCES `Artiste` (`ArtistID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ArtisteJeu`
--

LOCK TABLES `ArtisteJeu` WRITE;
/*!40000 ALTER TABLE `ArtisteJeu` DISABLE KEYS */;
INSERT INTO `ArtisteJeu` VALUES
(1,1),
(2,2),
(3,3),
(4,4),
(5,5),
(6,6),
(7,7),
(8,8),
(9,10),
(10,9);
/*!40000 ALTER TABLE `ArtisteJeu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Avis`
--

DROP TABLE IF EXISTS `Avis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Avis` (
  `AvisID` int(11) NOT NULL AUTO_INCREMENT,
  `Contenu` varchar(255) DEFAULT NULL,
  `Note` int(11) NOT NULL,
  `JeuID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  PRIMARY KEY (`AvisID`),
  KEY `idx_avis_jeuid` (`JeuID`),
  KEY `idx_avis_userid` (`UserID`),
  CONSTRAINT `Avis_ibfk_1` FOREIGN KEY (`JeuID`) REFERENCES `Jeu` (`JeuID`),
  CONSTRAINT `Avis_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `Utilisateur` (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Avis`
--

LOCK TABLES `Avis` WRITE;
/*!40000 ALTER TABLE `Avis` DISABLE KEYS */;
INSERT INTO `Avis` VALUES
(1,'Great game!',9,1,1),
(2,'Classic!',8,2,2),
(3,'Fun with friends',7,3,3),
(4,'Strategic',8,4,4),
(5,'Replayable',9,5,5),
(6,'Family favorite',8,6,6),
(7,'Party hit',7,7,7),
(8,'Deep strategy',10,8,8),
(9,'Excellent 2p',8,9,9),
(10,'Challenging',9,10,10);
/*!40000 ALTER TABLE `Avis` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER before_insert_avis
BEFORE INSERT ON Avis
FOR EACH ROW
BEGIN
   
   DECLARE avis_count INT;

   SELECT COUNT(*) INTO avis_count
   FROM Avis
   WHERE JeuID = NEW.JeuID AND UserID = NEW.UserID;

   
   IF avis_count > 0 THEN
      SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'L’utilisateur a déjà noté ce jeu.';
   END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER after_insert_avis
AFTER INSERT ON Avis
FOR EACH ROW
BEGIN
   
   DECLARE new_avg DECIMAL(15,2);
   DECLARE avis_count INT;

   SELECT AVG(Note), COUNT(*) INTO new_avg, avis_count
   FROM Avis
   WHERE JeuID = NEW.JeuID;

   
   UPDATE Jeu
   SET Average = IFNULL(new_avg, 0.00),
       UsersRated = avis_count
   WHERE JeuID = NEW.JeuID;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER after_delete_avis
AFTER DELETE ON Avis
FOR EACH ROW
BEGIN
   
   DECLARE new_avg DECIMAL(15,2);
   DECLARE avis_count INT;

   SELECT AVG(Note), COUNT(*) INTO new_avg, avis_count
   FROM Avis
   WHERE JeuID = OLD.JeuID;

   
   UPDATE Jeu
   SET Average = IFNULL(new_avg, 0.00),
       UsersRated = avis_count
   WHERE JeuID = OLD.JeuID;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `Categorie`
--

DROP TABLE IF EXISTS `Categorie`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Categorie` (
  `CategorieID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  PRIMARY KEY (`CategorieID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Categorie`
--

LOCK TABLES `Categorie` WRITE;
/*!40000 ALTER TABLE `Categorie` DISABLE KEYS */;
INSERT INTO `Categorie` VALUES
(1,'Medical'),
(2,'City Building'),
(3,'Economic'),
(4,'Ancient'),
(5,'Card Game'),
(6,'Farming'),
(7,'Trains'),
(8,'Deduction'),
(9,'Science Fiction'),
(10,'Territory Building');
/*!40000 ALTER TABLE `Categorie` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CategorieJeu`
--

DROP TABLE IF EXISTS `CategorieJeu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `CategorieJeu` (
  `JeuID` int(11) NOT NULL,
  `CategorieID` int(11) NOT NULL,
  PRIMARY KEY (`JeuID`,`CategorieID`),
  KEY `idx_catjeu_jeuid` (`JeuID`),
  KEY `idx_catjeu_catid` (`CategorieID`),
  CONSTRAINT `CategorieJeu_ibfk_1` FOREIGN KEY (`JeuID`) REFERENCES `Jeu` (`JeuID`),
  CONSTRAINT `CategorieJeu_ibfk_2` FOREIGN KEY (`CategorieID`) REFERENCES `Categorie` (`CategorieID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CategorieJeu`
--

LOCK TABLES `CategorieJeu` WRITE;
/*!40000 ALTER TABLE `CategorieJeu` DISABLE KEYS */;
INSERT INTO `CategorieJeu` VALUES
(1,1),
(2,2),
(3,3),
(4,4),
(5,5),
(6,7),
(7,8),
(8,9),
(9,4),
(10,6);
/*!40000 ALTER TABLE `CategorieJeu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Commentaire`
--

DROP TABLE IF EXISTS `Commentaire`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Commentaire` (
  `CommentaireID` int(11) NOT NULL AUTO_INCREMENT,
  `Contenu` varchar(1000) DEFAULT NULL,
  `AvisID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  PRIMARY KEY (`CommentaireID`),
  KEY `AvisID` (`AvisID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `Commentaire_ibfk_1` FOREIGN KEY (`AvisID`) REFERENCES `Avis` (`AvisID`),
  CONSTRAINT `Commentaire_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `Utilisateur` (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Commentaire`
--

LOCK TABLES `Commentaire` WRITE;
/*!40000 ALTER TABLE `Commentaire` DISABLE KEYS */;
INSERT INTO `Commentaire` VALUES
(1,'I agree!',1,2),
(2,'Totally!',2,3),
(3,'Nice review',3,4),
(4,'Good point',4,5),
(5,'Absolutely',5,6),
(6,'Well said',6,7),
(7,'So true',7,8),
(8,'Love it',8,9),
(9,'Great insight',9,10),
(10,'Thanks for sharing',10,1);
/*!40000 ALTER TABLE `Commentaire` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CreationJeu`
--

DROP TABLE IF EXISTS `CreationJeu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `CreationJeu` (
  `UserID` int(11) NOT NULL,
  `JeuID` int(11) NOT NULL,
  PRIMARY KEY (`UserID`,`JeuID`),
  KEY `JeuID` (`JeuID`),
  CONSTRAINT `CreationJeu_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Utilisateur` (`UserID`),
  CONSTRAINT `CreationJeu_ibfk_2` FOREIGN KEY (`JeuID`) REFERENCES `Jeu` (`JeuID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CreationJeu`
--

LOCK TABLES `CreationJeu` WRITE;
/*!40000 ALTER TABLE `CreationJeu` DISABLE KEYS */;
INSERT INTO `CreationJeu` VALUES
(1,1),
(2,2),
(3,3),
(4,4),
(5,5),
(6,6),
(7,7),
(8,8),
(9,9),
(10,10);
/*!40000 ALTER TABLE `CreationJeu` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER before_insert_creationjeu
BEFORE INSERT ON CreationJeu
FOR EACH ROW
BEGIN
   
   DECLARE user_statut VARCHAR(50);

   SELECT Statut INTO user_statut
   FROM Utilisateur
   WHERE UserID = NEW.UserID;

   
   IF user_statut NOT IN ('Editeur', 'Admin') THEN
      SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Seuls les éditeurs et administrateurs peuvent créer des jeux.';
   END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `DesignJeu`
--

DROP TABLE IF EXISTS `DesignJeu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `DesignJeu` (
  `JeuID` int(11) NOT NULL,
  `DesignerID` int(11) NOT NULL,
  PRIMARY KEY (`JeuID`,`DesignerID`),
  KEY `DesignerID` (`DesignerID`),
  CONSTRAINT `DesignJeu_ibfk_1` FOREIGN KEY (`JeuID`) REFERENCES `Jeu` (`JeuID`),
  CONSTRAINT `DesignJeu_ibfk_2` FOREIGN KEY (`DesignerID`) REFERENCES `Designer` (`DesignerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DesignJeu`
--

LOCK TABLES `DesignJeu` WRITE;
/*!40000 ALTER TABLE `DesignJeu` DISABLE KEYS */;
INSERT INTO `DesignJeu` VALUES
(1,1),
(2,2),
(3,3),
(4,4),
(5,5),
(6,6),
(7,7),
(8,8),
(9,10),
(10,9);
/*!40000 ALTER TABLE `DesignJeu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Designer`
--

DROP TABLE IF EXISTS `Designer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Designer` (
  `DesignerID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  PRIMARY KEY (`DesignerID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Designer`
--

LOCK TABLES `Designer` WRITE;
/*!40000 ALTER TABLE `Designer` DISABLE KEYS */;
INSERT INTO `Designer` VALUES
(1,'Matt Leacock'),
(2,'Klaus-Jürgen Wrede'),
(3,'Klaus Teuber'),
(4,'Antoine Bauza'),
(5,'Donald X. Vaccarino'),
(6,'Alan R. Moon'),
(7,'Vlaada Chvátil'),
(8,'Jacob Fryxelius'),
(9,'Uwe Rosenberg'),
(10,'Bruno Cathala');
/*!40000 ALTER TABLE `Designer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Extension`
--

DROP TABLE IF EXISTS `Extension`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Extension` (
  `ExtensionID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  `JeuID` int(11) NOT NULL,
  PRIMARY KEY (`ExtensionID`),
  KEY `JeuID` (`JeuID`),
  CONSTRAINT `Extension_ibfk_1` FOREIGN KEY (`JeuID`) REFERENCES `Jeu` (`JeuID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Extension`
--

LOCK TABLES `Extension` WRITE;
/*!40000 ALTER TABLE `Extension` DISABLE KEYS */;
INSERT INTO `Extension` VALUES
(1,'Pandemic: In the Lab',1),
(2,'Carcassonne: Expansion 1 – Inns & Cathedrals',2),
(3,'Catan: Seafarers',3),
(4,'7 Wonders: Leaders',4),
(5,'Dominion: Intrigue (Second Edition)',5),
(6,'Ticket to Ride: Europe',6),
(7,'Codenames: Blizzard Edition',7),
(8,'Terraforming Mars: Prelude',8),
(9,'7 Wonders Duel: Agora',9),
(10,'Agricola: Farmers of the Moor',10);
/*!40000 ALTER TABLE `Extension` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Famille`
--

DROP TABLE IF EXISTS `Famille`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Famille` (
  `FamilleID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  PRIMARY KEY (`FamilleID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Famille`
--

LOCK TABLES `Famille` WRITE;
/*!40000 ALTER TABLE `Famille` DISABLE KEYS */;
INSERT INTO `Famille` VALUES
(1,'Game: Pandemic'),
(2,'Game: Carcassonne'),
(3,'Game: Catan'),
(4,'Game: 7 Wonders'),
(5,'Game: Dominion'),
(6,'Game: Ticket to Ride (Official)'),
(7,'Game: Codenames'),
(8,'Game: Terraforming Mars'),
(9,'Game: Agricola'),
(10,'Game: 7 Wonders Duel');
/*!40000 ALTER TABLE `Famille` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FamillesJeu`
--

DROP TABLE IF EXISTS `FamillesJeu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `FamillesJeu` (
  `JeuID` int(11) NOT NULL,
  `FamilleID` int(11) NOT NULL,
  PRIMARY KEY (`JeuID`,`FamilleID`),
  KEY `FamilleID` (`FamilleID`),
  CONSTRAINT `FamillesJeu_ibfk_1` FOREIGN KEY (`JeuID`) REFERENCES `Jeu` (`JeuID`),
  CONSTRAINT `FamillesJeu_ibfk_2` FOREIGN KEY (`FamilleID`) REFERENCES `Famille` (`FamilleID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FamillesJeu`
--

LOCK TABLES `FamillesJeu` WRITE;
/*!40000 ALTER TABLE `FamillesJeu` DISABLE KEYS */;
INSERT INTO `FamillesJeu` VALUES
(1,1),
(2,2),
(3,3),
(4,4),
(5,5),
(6,6),
(7,7),
(8,8),
(9,10),
(10,9);
/*!40000 ALTER TABLE `FamillesJeu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Implementation`
--

DROP TABLE IF EXISTS `Implementation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Implementation` (
  `ImplementationID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  `JeuID` int(11) NOT NULL,
  PRIMARY KEY (`ImplementationID`),
  KEY `JeuID` (`JeuID`),
  CONSTRAINT `Implementation_ibfk_1` FOREIGN KEY (`JeuID`) REFERENCES `Jeu` (`JeuID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Implementation`
--

LOCK TABLES `Implementation` WRITE;
/*!40000 ALTER TABLE `Implementation` DISABLE KEYS */;
INSERT INTO `Implementation` VALUES
(1,'Pandemic Legacy: Season 1',1),
(2,'Carcassonne Junior',2),
(3,'Catan: Family Edition',3),
(4,'7 Wonders Duel',4),
(5,'Dominion (Second Edition)',5),
(6,'Ticket to Ride: London',6),
(7,'Codenames: Blizzard Edition',7),
(8,'Terraforming Mars: Ares Expedition',8),
(9,'7 Wonders (Second Edition)',9),
(10,'Agricola (Revised Edition)',10);
/*!40000 ALTER TABLE `Implementation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Jeu`
--

DROP TABLE IF EXISTS `Jeu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Jeu` (
  `JeuID` int(11) NOT NULL AUTO_INCREMENT,
  `Nom` varchar(50) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `YearPublished` int(11) DEFAULT NULL,
  `MinPlayers` int(11) DEFAULT NULL,
  `MaxPlayers` int(11) DEFAULT NULL,
  `PlayingTime` time DEFAULT NULL,
  `MinPlayTime` time DEFAULT NULL,
  `MaxPlayTime` time DEFAULT NULL,
  `MinAge` int(11) DEFAULT NULL,
  `Owned` int(11) DEFAULT NULL,
  `Trading` int(11) DEFAULT NULL,
  `Wanting` int(11) DEFAULT NULL,
  `Wishing` int(11) DEFAULT NULL,
  `Rank_` int(11) DEFAULT NULL,
  `Average` decimal(15,2) DEFAULT NULL,
  `Bayes_average` decimal(15,2) DEFAULT NULL,
  `UsersRated` int(11) DEFAULT NULL,
  `ImageURL` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`JeuID`),
  KEY `idx_nom_jeu` (`Nom`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Jeu`
--

LOCK TABLES `Jeu` WRITE;
/*!40000 ALTER TABLE `Jeu` DISABLE KEYS */;
INSERT INTO `Jeu` VALUES
(1,'Pandemic','In Pandemic, several virulent diseases have broken out simultaneously all over the world! The players are disease-fighting specialists whose mission is to treat disease hotspots while researching cures for each of four plagues before they get out of hand...',2008,2,4,'00:45:00','00:45:00','00:45:00',8,168364,2508,625,9344,106,9.00,7.49,1,'https://cf.geekdo-images.com/S3ybV1LAp-8SnHIXLLjVqA__micro/img/S4tXI3Yo7BtqmBoKINLLVUFsaJ0=/fit-in/64x64/filters:strip_icc()/pic1534148.jpg'),
(2,'Carcassonne','Carcassonne is a tile-placement game in which the players draw and place a tile with a piece of southern French landscape on it...',2000,2,5,'00:45:00','00:30:00','00:45:00',7,161299,1716,582,7383,190,8.00,7.31,1,'https://cf.geekdo-images.com/okM0dq_bEXnbyQTOvHfwRA__micro/img/VfLoKzfk3xj26ArmDu55qZ4sysw=/fit-in/64x64/filters:strip_icc()/pic6544250.png'),
(3,'Catan','In CATAN (formerly The Settlers of Catan), players try to be the dominant force on the island of Catan by building settlements, cities, and roads...',1995,3,4,'02:00:00','01:00:00','02:00:00',10,167733,2018,485,5890,429,7.00,6.97,1,'https://cf.geekdo-images.com/W3Bsga_uLP9kO91gZ7H8yw__micro/img/LA4OvGfQ_TXQ-2mhaIFZp2ITWpc=/fit-in/64x64/filters:strip_icc()/pic2419375.jpg'),
(4,'7 Wonders','You are the leader of one of the 7 great cities of the Ancient World. Gather resources, develop commercial routes, and affirm your military supremacy...',2010,2,7,'00:30:00','00:30:00','00:30:00',10,120466,1567,1010,12105,73,8.00,7.63,1,'https://cf.geekdo-images.com/RvFVTEpnbb4NM7k0IF8V7A__micro/img/9glsOs7zoTbkVpfDt5SHWJm-kRA=/fit-in/64x64/filters:strip_icc()/pic860217.jpg'),
(5,'Dominion','You are a monarch, like your parents before you, a ruler of a small pleasant kingdom of rivers and evergreens. Unlike your parents, however, you have hopes and dreams!...',2008,2,4,'00:30:00','00:30:00','00:30:00',13,106956,2009,655,8621,104,9.00,7.50,1,'https://cf.geekdo-images.com/j6iQpZ4XkemZP07HNCODBA__micro/img/PVxqHWOLTb3n-4xe62LJadr_M0I=/fit-in/64x64/filters:strip_icc()/pic394356.jpg'),
(6,'Ticket to Ride','With elegantly simple gameplay, Ticket to Ride can be learned in under 15 minutes. Players collect cards of various types of train cars they then use to claim railway routes in North America...',2004,2,5,'01:00:00','00:30:00','01:00:00',8,105748,930,692,6620,192,8.00,7.31,1,'https://cf.geekdo-images.com/ZWJg0dCdrWHxVnc0eFXK8w__micro/img/79tvkijvf1wFKrKz-FWt77XdIbw=/fit-in/64x64/filters:strip_icc()/pic38668.jpg'),
(7,'Codenames','Codenames is an easy party game to solve puzzles. The game is divided into red and blue, each side has a team leader, the team leader\'s goal is to lead their team to the final victory...',2015,2,8,'00:15:00','00:15:00','00:15:00',14,119753,1110,340,5764,101,7.00,7.51,1,'https://cf.geekdo-images.com/F_KDEu0GjdClml8N7c8Imw__micro/img/w38Q9MZMQK80Att5GcODbCGufDk=/fit-in/64x64/filters:strip_icc()/pic2582929.jpg'),
(8,'Terraforming Mars','In the 2400s, mankind begins to terraform the planet Mars. Giant corporations, sponsored by the World Government on Earth, initiate huge projects to raise the temperature, the oxygen level, and the ocean coverage...',2016,1,5,'02:00:00','02:00:00','02:00:00',12,101872,538,2011,19227,4,10.00,8.27,1,'https://cf.geekdo-images.com/wg9oOLcsKvDesSUdZQ4rxw__micro/img/LUkXZhd1TO80eCiXMD3-KfnzA6k=/fit-in/64x64/filters:strip_icc()/pic3536616.jpg'),
(9,'7 Wonders Duel','In many ways 7 Wonders Duel resembles its parent game 7 Wonders as over three ages players acquire cards that provide resources or advance their military or scientific development...',2015,2,2,'00:30:00','00:30:00','00:30:00',10,111275,683,924,8836,16,8.00,7.98,1,'https://cf.geekdo-images.com/WzNs1mA_o22ZWTR8fkLP2g__micro/img/xh3isprMbt_FCg9vs3w_ifv-JXY=/fit-in/64x64/filters:strip_icc()/pic3376065.jpg'),
(10,'Agricola','Description from BoardgameNews...In Agricola, you\'re a farmer in a wooden shack with your spouse and little else. On a turn, you get to take only two actions, one for you and one for the spouse, from all the possibilities you\'ll find on a farm...',2007,1,5,'02:30:00','00:30:00','02:30:00',12,78591,1300,1150,11122,36,9.00,7.81,1,'https://cf.geekdo-images.com/dDDo2Hexl80ucK1IlqTk-g__micro/img/SZgGqufNqaW8BCFT29wkYPaRXOE=/fit-in/64x64/filters:strip_icc()/pic831744.jpg');
/*!40000 ALTER TABLE `Jeu` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER before_delete_jeu
BEFORE DELETE ON Jeu
FOR EACH ROW
BEGIN
   
   DELETE FROM Commentaire WHERE AvisID IN (SELECT AvisID FROM Avis WHERE JeuID = OLD.JeuID);
   DELETE FROM Avis WHERE JeuID = OLD.JeuID;
   DELETE FROM CreationJeu WHERE JeuID = OLD.JeuID;
   DELETE FROM JeuFavoriUser WHERE JeuID = OLD.JeuID;
   
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `JeuFavoriUser`
--

DROP TABLE IF EXISTS `JeuFavoriUser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `JeuFavoriUser` (
  `UserID` int(11) NOT NULL,
  `JeuID` int(11) NOT NULL,
  PRIMARY KEY (`UserID`,`JeuID`),
  KEY `JeuID` (`JeuID`),
  CONSTRAINT `JeuFavoriUser_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Utilisateur` (`UserID`),
  CONSTRAINT `JeuFavoriUser_ibfk_2` FOREIGN KEY (`JeuID`) REFERENCES `Jeu` (`JeuID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `JeuFavoriUser`
--

LOCK TABLES `JeuFavoriUser` WRITE;
/*!40000 ALTER TABLE `JeuFavoriUser` DISABLE KEYS */;
INSERT INTO `JeuFavoriUser` VALUES
(1,1),
(2,2),
(3,3),
(4,4),
(5,5),
(6,6),
(7,7),
(8,8),
(9,9),
(10,10);
/*!40000 ALTER TABLE `JeuFavoriUser` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER before_insert_jeufavori
BEFORE INSERT ON JeuFavoriUser
FOR EACH ROW
BEGIN
   
   DECLARE favoris_count INT;

   SELECT COUNT(*) INTO favoris_count
   FROM JeuFavoriUser
   WHERE UserID = NEW.UserID;

   
   IF favoris_count >= 20 THEN
      SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Vous ne pouvez pas avoir plus de 20 jeux favoris.';
   END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `Mechaniques`
--

DROP TABLE IF EXISTS `Mechaniques`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Mechaniques` (
  `MechaniquesID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  PRIMARY KEY (`MechaniquesID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Mechaniques`
--

LOCK TABLES `Mechaniques` WRITE;
/*!40000 ALTER TABLE `Mechaniques` DISABLE KEYS */;
INSERT INTO `Mechaniques` VALUES
(1,'Action Points'),
(2,'Tile Placement'),
(3,'Hand Management'),
(4,'Set Collection'),
(5,'Drafting'),
(6,'Variable Player Powers'),
(7,'Network and Route Building'),
(8,'Cooperative Game'),
(9,'Dice Rolling'),
(10,'Worker Placement');
/*!40000 ALTER TABLE `Mechaniques` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MechaniquesJeu`
--

DROP TABLE IF EXISTS `MechaniquesJeu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `MechaniquesJeu` (
  `JeuID` int(11) NOT NULL,
  `MechaniquesID` int(11) NOT NULL,
  PRIMARY KEY (`JeuID`,`MechaniquesID`),
  KEY `idx_mechjeu_jeuid` (`JeuID`),
  KEY `idx_mechjeu_mechid` (`MechaniquesID`),
  CONSTRAINT `MechaniquesJeu_ibfk_1` FOREIGN KEY (`JeuID`) REFERENCES `Jeu` (`JeuID`),
  CONSTRAINT `MechaniquesJeu_ibfk_2` FOREIGN KEY (`MechaniquesID`) REFERENCES `Mechaniques` (`MechaniquesID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MechaniquesJeu`
--

LOCK TABLES `MechaniquesJeu` WRITE;
/*!40000 ALTER TABLE `MechaniquesJeu` DISABLE KEYS */;
INSERT INTO `MechaniquesJeu` VALUES
(1,1),
(2,2),
(3,7),
(4,5),
(5,3),
(6,7),
(7,4),
(8,5),
(9,4),
(10,10);
/*!40000 ALTER TABLE `MechaniquesJeu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Utilisateur`
--

DROP TABLE IF EXISTS `Utilisateur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Utilisateur` (
  `UserID` int(11) NOT NULL AUTO_INCREMENT,
  `Nom` varchar(50) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `Email` varchar(50) NOT NULL,
  `Statut` varchar(50) NOT NULL,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Utilisateur`
--

LOCK TABLES `Utilisateur` WRITE;
/*!40000 ALTER TABLE `Utilisateur` DISABLE KEYS */;
INSERT INTO `Utilisateur` VALUES
(1,'Alice','pass1','alice@example.com','Admin'),
(2,'Bob','pass2','bob@example.com','Editeur'),
(3,'Charlie','pass3','charlie@example.com','Editeur'),
(4,'David','pass4','david@example.com','Editeur'),
(5,'Eve','pass5','eve@example.com','Editeur'),
(6,'Frank','pass6','frank@example.com','Editeur'),
(7,'Grace','pass7','grace@example.com','Editeur'),
(8,'Heidi','pass8','heidi@example.com','Editeur'),
(9,'Ivan','pass9','ivan@example.com','Editeur'),
(10,'Judy','pass10','judy@example.com','Editeur');
/*!40000 ALTER TABLE `Utilisateur` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary table structure for view `Vue_AvisParJeu`
--

DROP TABLE IF EXISTS `Vue_AvisParJeu`;
/*!50001 DROP VIEW IF EXISTS `Vue_AvisParJeu`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `Vue_AvisParJeu` AS SELECT
 1 AS `Jeu`,
  1 AS `Note`,
  1 AS `Avis`,
  1 AS `Auteur` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `Vue_JeuxDisponibles`
--

DROP TABLE IF EXISTS `Vue_JeuxDisponibles`;
/*!50001 DROP VIEW IF EXISTS `Vue_JeuxDisponibles`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `Vue_JeuxDisponibles` AS SELECT
 1 AS `JeuID`,
  1 AS `Nom`,
  1 AS `YearPublished`,
  1 AS `MinPlayers`,
  1 AS `MaxPlayers`,
  1 AS `PlayingTime`,
  1 AS `MinAge`,
  1 AS `Rank_`,
  1 AS `Average`,
  1 AS `Bayes_average`,
  1 AS `UsersRated`,
  1 AS `ImageURL` */;
SET character_set_client = @saved_cs_client;

--
-- Dumping routines for database 'JDSfr'
--
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP FUNCTION IF EXISTS `AgeMoyenCategorie` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `AgeMoyenCategorie`(cat_id INT) RETURNS decimal(5,2)
    DETERMINISTIC
BEGIN
   
   RETURN (
      SELECT AVG(j.MinAge)
      FROM Jeu j
      JOIN CategorieJeu cj ON j.JeuID = cj.JeuID
      WHERE cj.CategorieID = cat_id
   );
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP FUNCTION IF EXISTS `CountAvis` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `CountAvis`(JeuID INT) RETURNS int(11)
    DETERMINISTIC
BEGIN
   
   DECLARE total INT;
   SELECT COUNT(*) INTO total FROM Avis WHERE Avis.JeuID = JeuID;

   RETURN total;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP FUNCTION IF EXISTS `GetAverageNote` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `GetAverageNote`(JeuID INT) RETURNS decimal(5,2)
    DETERMINISTIC
BEGIN
   
   DECLARE avg_note DECIMAL(5,2);
   SELECT AVG(Note) INTO avg_note FROM Avis WHERE Avis.JeuID = JeuID;

   
   RETURN IFNULL(avg_note, 0.00);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP FUNCTION IF EXISTS `GetJeuxCreePar` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `GetJeuxCreePar`(user_id INT) RETURNS int(11)
    DETERMINISTIC
BEGIN
   
   DECLARE nb_jeux INT;
   SELECT COUNT(*) INTO nb_jeux
   FROM CreationJeu
   WHERE UserID = user_id;

   RETURN nb_jeux;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `AddFavoriteGame` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `AddFavoriteGame`(
   IN user_id INT,
   IN game_id INT
)
BEGIN
   INSERT INTO JeuFavoriUser (UserID, JeuID)
   VALUES (user_id, game_id);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `AddNewUser` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `AddNewUser`(
   IN user_name VARCHAR(50),
   IN user_password VARCHAR(50),
   IN user_email VARCHAR(50),
   IN user_status VARCHAR(50)
)
BEGIN
   INSERT INTO Utilisateur (Nom, Password, Email, Statut)
   VALUES (user_name, user_password, user_email, user_status);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `AddReview` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `AddReview`(
   IN review_content VARCHAR(50),
   IN review_note INT,
   IN game_id INT,
   IN user_id INT
)
BEGIN
   INSERT INTO Avis (Contenu, Note, JeuID, UserID)
   VALUES (review_content, review_note, game_id, user_id);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetGamesByAgeRange` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetGamesByAgeRange`(
   IN min_age INT,
   IN max_age INT
)
BEGIN
   SELECT *
   FROM Jeu
   WHERE MinAge BETWEEN min_age AND max_age;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetReviewsForGame` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetReviewsForGame`(IN game_id INT)
BEGIN
   SELECT a.*, u.Nom AS UserName
   FROM Avis a
   JOIN Utilisateur u ON a.UserID = u.UserID
   WHERE a.JeuID = game_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetUsersFavoriteGames` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetUsersFavoriteGames`(IN user_id INT)
BEGIN
   SELECT j.*
   FROM Jeu j
   JOIN JeuFavoriUser jf ON j.JeuID = jf.JeuID
   WHERE jf.UserID = user_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Final view structure for view `Vue_AvisParJeu`
--

/*!50001 DROP VIEW IF EXISTS `Vue_AvisParJeu`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb3 */;
/*!50001 SET character_set_results     = utf8mb3 */;
/*!50001 SET collation_connection      = utf8mb3_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `Vue_AvisParJeu` AS select `j`.`Nom` AS `Jeu`,`a`.`Note` AS `Note`,`a`.`Contenu` AS `Avis`,`u`.`Nom` AS `Auteur` from ((`Avis` `a` join `Jeu` `j` on(`a`.`JeuID` = `j`.`JeuID`)) join `Utilisateur` `u` on(`a`.`UserID` = `u`.`UserID`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `Vue_JeuxDisponibles`
--

/*!50001 DROP VIEW IF EXISTS `Vue_JeuxDisponibles`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb3 */;
/*!50001 SET character_set_results     = utf8mb3 */;
/*!50001 SET collation_connection      = utf8mb3_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `Vue_JeuxDisponibles` AS select `j`.`JeuID` AS `JeuID`,`j`.`Nom` AS `Nom`,`j`.`YearPublished` AS `YearPublished`,`j`.`MinPlayers` AS `MinPlayers`,`j`.`MaxPlayers` AS `MaxPlayers`,`j`.`PlayingTime` AS `PlayingTime`,`j`.`MinAge` AS `MinAge`,`j`.`Rank_` AS `Rank_`,`j`.`Average` AS `Average`,`j`.`Bayes_average` AS `Bayes_average`,`j`.`UsersRated` AS `UsersRated`,`j`.`ImageURL` AS `ImageURL` from `Jeu` `j` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-18 12:16:13
