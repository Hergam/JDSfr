create database  JDSfr;
USE JDSfr;


CREATE TABLE Utilisateur(
   UserID INT AUTO_INCREMENT,
   Nom VARCHAR(50) NOT NULL,
   Password VARCHAR(255) NOT NULL,
   Email VARCHAR(50) NOT NULL,
   Statut VARCHAR(50) NOT NULL,
   PRIMARY KEY(UserID),
   UNIQUE(Email)
);


CREATE TABLE Jeu(
   JeuID INT AUTO_INCREMENT,
   Nom VARCHAR(50) NOT NULL,
   description VARCHAR(500),
   YearPublished INT,
   MinPlayers INT,
   MaxPlayers INT,
   PlayingTime TIME,
   MinPlayTime TIME,
   MaxPlayTime TIME,
   MinAge INT,
   MaxAge INT,
   Owned INT,
   Trading INT,
   Wanting INT,
   Wishing INT,
   Rank_ INT,
   Average DECIMAL(15,2),
   Bayes_average DECIMAL(15,2),
   UsersRated INT,
   ImageURL VARCHAR(255),
   PRIMARY KEY(JeuID)
);


CREATE TABLE Categorie(
   CategorieID INT AUTO_INCREMENT,
   Name VARCHAR(50) NOT NULL,
   PRIMARY KEY(CategorieID)
);


CREATE TABLE Mechaniques(
   MechaniquesID INT AUTO_INCREMENT,
   Name VARCHAR(50) NOT NULL,
   PRIMARY KEY(MechaniquesID)
);


CREATE TABLE Famille(
   FamilleID INT AUTO_INCREMENT,
   Name VARCHAR(50) NOT NULL,
   PRIMARY KEY(FamilleID)
);


CREATE TABLE Extension(
   ExtensionID INT AUTO_INCREMENT,
   Name VARCHAR(50) NOT NULL,
   JeuID INT NOT NULL,
   PRIMARY KEY(ExtensionID),
   FOREIGN KEY(JeuID) REFERENCES Jeu(JeuID)
);


CREATE TABLE Implementation(
   ImplementationID INT AUTO_INCREMENT,
   Name VARCHAR(50) NOT NULL,
   JeuID INT NOT NULL,
   PRIMARY KEY(ImplementationID),
   FOREIGN KEY(JeuID) REFERENCES Jeu(JeuID)
);


CREATE TABLE Designer(
   DesignerID INT AUTO_INCREMENT,
   Name VARCHAR(50) NOT NULL,
   PRIMARY KEY(DesignerID)
);


CREATE TABLE Artiste(
   ArtistID INT AUTO_INCREMENT,
   Name VARCHAR(50) NOT NULL,
   PRIMARY KEY(ArtistID)
);


CREATE TABLE Avis(
   AvisID INT AUTO_INCREMENT,
   Contenu VARCHAR(255),
   Note INT NOT NULL,
   JeuID INT NOT NULL,
   UserID INT NOT NULL,
   PRIMARY KEY(AvisID),
   FOREIGN KEY(JeuID) REFERENCES Jeu(JeuID),
   FOREIGN KEY(UserID) REFERENCES Utilisateur(UserID)
);


CREATE TABLE Commentaire(
   CommentaireID INT AUTO_INCREMENT,
   Contenu VARCHAR(1000),
   AvisID INT NOT NULL,
   UserID INT NOT NULL,
   PRIMARY KEY(CommentaireID),
   FOREIGN KEY(AvisID) REFERENCES Avis(AvisID),
   FOREIGN KEY(UserID) REFERENCES Utilisateur(UserID)
);


CREATE TABLE DesignJeu(
   JeuID INT,
   DesignerID INT,
   PRIMARY KEY(JeuID, DesignerID),
   FOREIGN KEY(JeuID) REFERENCES Jeu(JeuID),
   FOREIGN KEY(DesignerID) REFERENCES Designer(DesignerID)
);


CREATE TABLE CategorieJeu(
   JeuID INT,
   CategorieID INT,
   PRIMARY KEY(JeuID, CategorieID),
   FOREIGN KEY(JeuID) REFERENCES Jeu(JeuID),
   FOREIGN KEY(CategorieID) REFERENCES Categorie(CategorieID)
);


CREATE TABLE FamillesJeu(
   JeuID INT,
   FamilleID INT,
   PRIMARY KEY(JeuID, FamilleID),
   FOREIGN KEY(JeuID) REFERENCES Jeu(JeuID),
   FOREIGN KEY(FamilleID) REFERENCES Famille(FamilleID)
);


CREATE TABLE MechaniquesJeu(
   JeuID INT,
   MechaniquesID INT,
   PRIMARY KEY(JeuID, MechaniquesID),
   FOREIGN KEY(JeuID) REFERENCES Jeu(JeuID),
   FOREIGN KEY(MechaniquesID) REFERENCES Mechaniques(MechaniquesID)
);


CREATE TABLE ArtisteJeu(
   JeuID INT,
   ArtistID INT,
   PRIMARY KEY(JeuID, ArtistID),
   FOREIGN KEY(JeuID) REFERENCES Jeu(JeuID),
   FOREIGN KEY(ArtistID) REFERENCES Artiste(ArtistID)
);


CREATE TABLE CreationJeu(
   UserID INT,
   JeuID INT,
   PRIMARY KEY(UserID, JeuID),
   FOREIGN KEY(UserID) REFERENCES Utilisateur(UserID),
   FOREIGN KEY(JeuID) REFERENCES Jeu(JeuID)
);


CREATE TABLE JeuFavoriUser(
   UserID INT,
   JeuID INT,
   PRIMARY KEY(UserID, JeuID),
   FOREIGN KEY(UserID) REFERENCES Utilisateur(UserID),
   FOREIGN KEY(JeuID) REFERENCES Jeu(JeuID)
);

DELIMITER //

CREATE TRIGGER before_insert_creationjeu
BEFORE INSERT ON CreationJeu
FOR EACH ROW
BEGIN
   -- Vérifie le statut de l'utilisateur avant de permettre la création d'un jeu
   DECLARE user_statut VARCHAR(50);

   SELECT Statut INTO user_statut
   FROM Utilisateur
   WHERE UserID = NEW.UserID;

   -- Si l'utilisateur n'est pas 'Editeur' ou 'Admin', une erreur est levée
   IF user_statut NOT IN ('Editeur', 'Admin') THEN
      SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Seuls les éditeurs et administrateurs peuvent créer des jeux.';
   END IF;
END;
//

CREATE TRIGGER before_delete_jeu
BEFORE DELETE ON Jeu
FOR EACH ROW
BEGIN
   -- Supprime les avis, commentaires, créations et favoris associés au jeu
   DELETE FROM Commentaire WHERE AvisID IN (SELECT AvisID FROM Avis WHERE JeuID = OLD.JeuID);
   DELETE FROM Avis WHERE JeuID = OLD.JeuID;
   DELETE FROM CreationJeu WHERE JeuID = OLD.JeuID;
   DELETE FROM JeuFavoriUser WHERE JeuID = OLD.JeuID;
   -- etc.
END;
//

CREATE TRIGGER before_insert_avis
BEFORE INSERT ON Avis
FOR EACH ROW
BEGIN
   -- Vérifie si l'utilisateur a déjà noté ce jeu
   DECLARE avis_count INT;

   SELECT COUNT(*) INTO avis_count
   FROM Avis
   WHERE JeuID = NEW.JeuID AND UserID = NEW.UserID;

   -- Si un avis existe déjà, une erreur est levée
   IF avis_count > 0 THEN
      SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'L’utilisateur a déjà noté ce jeu.';
   END IF;
END;
//

CREATE TRIGGER after_insert_avis
AFTER INSERT ON Avis
FOR EACH ROW
BEGIN
   -- Calcule la nouvelle note moyenne et le nombre d'avis pour le jeu
   DECLARE new_avg DECIMAL(15,2);
   DECLARE avis_count INT;

   SELECT AVG(Note), COUNT(*) INTO new_avg, avis_count
   FROM Avis
   WHERE JeuID = NEW.JeuID;

   -- Met à jour la note moyenne et le nombre d'utilisateurs ayant noté le jeu
   UPDATE Jeu
   SET Average = IFNULL(new_avg, 0.00),
       UsersRated = avis_count
   WHERE JeuID = NEW.JeuID;
END;
//

CREATE TRIGGER after_delete_avis
AFTER DELETE ON Avis
FOR EACH ROW
BEGIN
   -- Calcule la nouvelle note moyenne et le nombre d'avis pour le jeu
   DECLARE new_avg DECIMAL(15,2);
   DECLARE avis_count INT;

   SELECT AVG(Note), COUNT(*) INTO new_avg, avis_count
   FROM Avis
   WHERE JeuID = OLD.JeuID;

   -- Met à jour la note moyenne et le nombre d'utilisateurs ayant noté le jeu
   UPDATE Jeu
   SET Average = IFNULL(new_avg, 0.00),
       UsersRated = avis_count
   WHERE JeuID = OLD.JeuID;
END;
//

CREATE TRIGGER before_insert_jeufavori
BEFORE INSERT ON JeuFavoriUser
FOR EACH ROW
BEGIN
   -- Vérifie si l'utilisateur a déjà 20 jeux favoris
   DECLARE favoris_count INT;

   SELECT COUNT(*) INTO favoris_count
   FROM JeuFavoriUser
   WHERE UserID = NEW.UserID;

   -- Si la limite est atteinte, une erreur est levée
   IF favoris_count >= 20 THEN
      SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Vous ne pouvez pas avoir plus de 20 jeux favoris.';
   END IF;
END;
//

CREATE FUNCTION GetJeuxCreePar(user_id INT)
RETURNS INT
DETERMINISTIC
BEGIN
   -- Compte le nombre de jeux créés par l'utilisateur
   DECLARE nb_jeux INT;
   SELECT COUNT(*) INTO nb_jeux
   FROM CreationJeu
   WHERE UserID = user_id;

   RETURN nb_jeux;
END;
//

CREATE FUNCTION AgeMoyenCategorie(cat_id INT)
RETURNS DECIMAL(5,2)
DETERMINISTIC
BEGIN
   -- Retourne l'âge minimum moyen des jeux dans la catégorie spécifiée
   RETURN (
      SELECT AVG(j.MinAge)
      FROM Jeu j
      JOIN CategorieJeu cj ON j.JeuID = cj.JeuID
      WHERE cj.CategorieID = cat_id
   );
END;
//

CREATE FUNCTION GetAverageNote(JeuID INT)
RETURNS DECIMAL(5,2)
DETERMINISTIC
BEGIN
   -- Calcule la note moyenne pour le jeu
   DECLARE avg_note DECIMAL(5,2);
   SELECT AVG(Note) INTO avg_note FROM Avis WHERE Avis.JeuID = JeuID;

   -- Retourne la note moyenne, ou 0.00 si aucun avis n'existe
   RETURN IFNULL(avg_note, 0.00);
END;
//

CREATE FUNCTION CountAvis(JeuID INT)
RETURNS INT
DETERMINISTIC
BEGIN
   -- Compte le nombre d'avis pour le jeu
   DECLARE total INT;
   SELECT COUNT(*) INTO total FROM Avis WHERE Avis.JeuID = JeuID;

   RETURN total;
END;
//

CREATE PROCEDURE AddNewUser(
   IN user_name VARCHAR(50),
   IN user_password VARCHAR(50),
   IN user_email VARCHAR(50),
   IN user_status VARCHAR(50)
)
BEGIN
   INSERT INTO Utilisateur (Nom, Password, Email, Statut)
   VALUES (user_name, user_password, user_email, user_status);
END;
//

CREATE PROCEDURE AddFavoriteGame(
   IN user_id INT,
   IN game_id INT
)
BEGIN
   INSERT INTO JeuFavoriUser (UserID, JeuID)
   VALUES (user_id, game_id);
END;
//

CREATE PROCEDURE GetReviewsForGame(IN game_id INT)
BEGIN
   SELECT a.*, u.Nom AS UserName
   FROM Avis a
   JOIN Utilisateur u ON a.UserID = u.UserID
   WHERE a.JeuID = game_id;
END;
//

CREATE PROCEDURE AddReview(
   IN review_content VARCHAR(50),
   IN review_note INT,
   IN game_id INT,
   IN user_id INT
)
BEGIN
   INSERT INTO Avis (Contenu, Note, JeuID, UserID)
   VALUES (review_content, review_note, game_id, user_id);
END;
//

CREATE PROCEDURE GetUsersFavoriteGames(IN user_id INT)
BEGIN
   SELECT j.*
   FROM Jeu j
   JOIN JeuFavoriUser jf ON j.JeuID = jf.JeuID
   WHERE jf.UserID = user_id;
END;
//

CREATE PROCEDURE GetGamesByAgeRange(
   IN min_age INT,
   IN max_age INT
)
BEGIN
   SELECT *
   FROM Jeu
   WHERE MinAge BETWEEN min_age AND max_age;
END;
//

DELIMITER ;

DELIMITER //

CREATE PROCEDURE GetGameFullDetails(IN p_JeuID INT)
BEGIN
    -- Designers
    SELECT d.DesignerID, d.Name
    FROM Designer d
    JOIN DesignJeu dj ON d.DesignerID = dj.DesignerID
    WHERE dj.JeuID = p_JeuID;

    -- Categories
    SELECT c.CategorieID, c.Name
    FROM Categorie c
    JOIN CategorieJeu cj ON c.CategorieID = cj.CategorieID
    WHERE cj.JeuID = p_JeuID;

    -- Familles
    SELECT f.FamilleID, f.Name
    FROM Famille f
    JOIN FamillesJeu fj ON f.FamilleID = fj.FamilleID
    WHERE fj.JeuID = p_JeuID;

    -- Mechaniques
    SELECT m.MechaniquesID, m.Name
    FROM Mechaniques m
    JOIN MechaniquesJeu mj ON m.MechaniquesID = mj.MechaniquesID
    WHERE mj.JeuID = p_JeuID;

    -- Artistes
    SELECT a.ArtistID, a.Name
    FROM Artiste a
    JOIN ArtisteJeu aj ON a.ArtistID = aj.ArtistID
    WHERE aj.JeuID = p_JeuID;

    -- Extensions
    SELECT e.ExtensionID, e.Name
    FROM Extension e
    WHERE e.JeuID = p_JeuID;

    -- Implementations
    SELECT i.ImplementationID, i.Name
    FROM Implementation i
    WHERE i.JeuID = p_JeuID;

    -- Avis
    SELECT av.AvisID, av.Contenu, av.Note, av.UserID
    FROM Avis av
    WHERE av.JeuID = p_JeuID;

    -- Commentaires (for all avis of this game)
    SELECT c.CommentaireID, c.Contenu, c.AvisID, c.UserID
    FROM Commentaire c
    JOIN Avis av ON c.AvisID = av.AvisID
    WHERE av.JeuID = p_JeuID;
END;
//

DELIMITER ;

CREATE INDEX idx_catjeu_jeuid ON CategorieJeu(JeuID);
CREATE INDEX idx_catjeu_catid ON CategorieJeu(CategorieID);


CREATE INDEX idx_mechjeu_jeuid ON MechaniquesJeu(JeuID);
CREATE INDEX idx_mechjeu_mechid ON MechaniquesJeu(MechaniquesID);

CREATE INDEX idx_avis_jeuid ON Avis(JeuID);
CREATE INDEX idx_avis_userid ON Avis(UserID);

CREATE INDEX idx_nom_jeu ON Jeu(Nom);

CREATE VIEW Vue_AvisParJeu AS
SELECT
    j.Nom AS Jeu,
    a.Note,
    a.Contenu AS Avis,
    u.Nom AS Auteur
FROM Avis a
JOIN Jeu j ON a.JeuID = j.JeuID
JOIN Utilisateur u ON a.UserID = u.UserID;

CREATE VIEW Vue_JeuxDisponibles AS
SELECT
    j.JeuID,
    j.Nom,
    j.YearPublished,
    j.MinPlayers,
    j.MaxPlayers,
    j.PlayingTime,
    j.MinAge,
    j.Rank_,
    j.Average,
    j.Bayes_average,
    j.UsersRated,
    j.ImageURL
FROM Jeu j;
