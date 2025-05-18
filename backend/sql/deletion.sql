USE JDSfr;

-- Disable foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- Truncate child tables first
TRUNCATE TABLE Commentaire;
TRUNCATE TABLE Avis;
TRUNCATE TABLE CreationJeu;
TRUNCATE TABLE JeuFavoriUser;
TRUNCATE TABLE ArtisteJeu;
TRUNCATE TABLE MechaniquesJeu;
TRUNCATE TABLE FamillesJeu;
TRUNCATE TABLE CategorieJeu;
TRUNCATE TABLE DesignJeu;
TRUNCATE TABLE Extension;
TRUNCATE TABLE Implementation;

-- Then truncate parent tables
TRUNCATE TABLE Utilisateur;
TRUNCATE TABLE Jeu;
TRUNCATE TABLE Categorie;
TRUNCATE TABLE Mechaniques;
TRUNCATE TABLE Famille;
TRUNCATE TABLE Designer;
TRUNCATE TABLE Artiste;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;