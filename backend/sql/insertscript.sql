-- Utilisateur (10 users, now all 'Editeur' to allow game creation)
INSERT INTO Utilisateur (Nom, Password, Email, Statut) VALUES
('Alice', 'pass1', 'alice@example.com', 'Editeur'),
('Bob', 'pass2', 'bob@example.com', 'Editeur'),
('Charlie', 'pass3', 'charlie@example.com', 'Editeur'),
('David', 'pass4', 'david@example.com', 'Editeur'),
('Eve', 'pass5', 'eve@example.com', 'Editeur'),
('Frank', 'pass6', 'frank@example.com', 'Editeur'),
('Grace', 'pass7', 'grace@example.com', 'Editeur'),
('Heidi', 'pass8', 'heidi@example.com', 'Editeur'),
('Ivan', 'pass9', 'ivan@example.com', 'Editeur'),
('Judy', 'pass10', 'judy@example.com', 'Editeur');

-- Jeu (10 games, using ratings.csv and details.csv)
INSERT INTO Jeu (Nom, description, YearPublished, MinPlayers, MaxPlayers, PlayingTime, MinPlayTime, MaxPlayTime, MinAge, Owned, Trading, Wanting, Wishing, Rank_, Average, Bayes_average, UsersRated, ImageURL)
VALUES
('Pandemic', 'In Pandemic, several virulent diseases have broken out simultaneously all over the world! The players are disease-fighting specialists whose mission is to treat disease hotspots while researching cures for each of four plagues before they get out of hand...', 2008, 2, 4, '00:45:00', '00:45:00', '00:45:00', 8, 168364, 2508, 625, 9344, 106, 7.59, 7.49, 108975, 'https://cf.geekdo-images.com/S3ybV1LAp-8SnHIXLLjVqA__micro/img/S4tXI3Yo7BtqmBoKINLLVUFsaJ0=/fit-in/64x64/filters:strip_icc()/pic1534148.jpg'),
('Carcassonne', 'Carcassonne is a tile-placement game in which the players draw and place a tile with a piece of southern French landscape on it...', 2000, 2, 5, '00:45:00', '00:30:00', '00:45:00', 7, 161299, 1716, 582, 7383, 190, 7.42, 7.31, 108738, 'https://cf.geekdo-images.com/okM0dq_bEXnbyQTOvHfwRA__micro/img/VfLoKzfk3xj26ArmDu55qZ4sysw=/fit-in/64x64/filters:strip_icc()/pic6544250.png'),
('Catan', 'In CATAN (formerly The Settlers of Catan), players try to be the dominant force on the island of Catan by building settlements, cities, and roads...', 1995, 3, 4, '02:00:00', '01:00:00', '02:00:00', 10, 167733, 2018, 485, 5890, 429, 7.14, 6.97, 108024, 'https://cf.geekdo-images.com/W3Bsga_uLP9kO91gZ7H8yw__micro/img/LA4OvGfQ_TXQ-2mhaIFZp2ITWpc=/fit-in/64x64/filters:strip_icc()/pic2419375.jpg'),
('7 Wonders', 'You are the leader of one of the 7 great cities of the Ancient World. Gather resources, develop commercial routes, and affirm your military supremacy...', 2010, 2, 7, '00:30:00', '00:30:00', '00:30:00', 10, 120466, 1567, 1010, 12105, 73, 7.74, 7.63, 89982, 'https://cf.geekdo-images.com/RvFVTEpnbb4NM7k0IF8V7A__micro/img/9glsOs7zoTbkVpfDt5SHWJm-kRA=/fit-in/64x64/filters:strip_icc()/pic860217.jpg'),
('Dominion', 'You are a monarch, like your parents before you, a ruler of a small pleasant kingdom of rivers and evergreens. Unlike your parents, however, you have hopes and dreams!...', 2008, 2, 4, '00:30:00', '00:30:00', '00:30:00', 13, 106956, 2009, 655, 8621, 104, 7.61, 7.50, 81561, 'https://cf.geekdo-images.com/j6iQpZ4XkemZP07HNCODBA__micro/img/PVxqHWOLTb3n-4xe62LJadr_M0I=/fit-in/64x64/filters:strip_icc()/pic394356.jpg'),
('Ticket to Ride', 'With elegantly simple gameplay, Ticket to Ride can be learned in under 15 minutes. Players collect cards of various types of train cars they then use to claim railway routes in North America...', 2004, 2, 5, '01:00:00', '00:30:00', '01:00:00', 8, 105748, 930, 692, 6620, 192, 7.41, 7.31, 76171, 'https://cf.geekdo-images.com/ZWJg0dCdrWHxVnc0eFXK8w__micro/img/79tvkijvf1wFKrKz-FWt77XdIbw=/fit-in/64x64/filters:strip_icc()/pic38668.jpg'),
('Codenames', 'Codenames is an easy party game to solve puzzles. The game is divided into red and blue, each side has a team leader, the team leader''s goal is to lead their team to the final victory...', 2015, 2, 8, '00:15:00', '00:15:00', '00:15:00', 14, 119753, 1110, 340, 5764, 101, 7.60, 7.51, 74419, 'https://cf.geekdo-images.com/F_KDEu0GjdClml8N7c8Imw__micro/img/w38Q9MZMQK80Att5GcODbCGufDk=/fit-in/64x64/filters:strip_icc()/pic2582929.jpg'),
('Terraforming Mars', 'In the 2400s, mankind begins to terraform the planet Mars. Giant corporations, sponsored by the World Government on Earth, initiate huge projects to raise the temperature, the oxygen level, and the ocean coverage...', 2016, 1, 5, '02:00:00', '02:00:00', '02:00:00', 12, 101872, 538, 2011, 19227, 4, 8.42, 8.27, 74216, 'https://cf.geekdo-images.com/wg9oOLcsKvDesSUdZQ4rxw__micro/img/LUkXZhd1TO80eCiXMD3-KfnzA6k=/fit-in/64x64/filters:strip_icc()/pic3536616.jpg'),
('7 Wonders Duel', 'In many ways 7 Wonders Duel resembles its parent game 7 Wonders as over three ages players acquire cards that provide resources or advance their military or scientific development...', 2015, 2, 2, '00:30:00', '00:30:00', '00:30:00', 10, 111275, 683, 924, 8836, 16, 8.11, 7.98, 69472, 'https://cf.geekdo-images.com/WzNs1mA_o22ZWTR8fkLP2g__micro/img/xh3isprMbt_FCg9vs3w_ifv-JXY=/fit-in/64x64/filters:strip_icc()/pic3376065.jpg'),
('Agricola', 'Description from BoardgameNews...In Agricola, you''re a farmer in a wooden shack with your spouse and little else. On a turn, you get to take only two actions, one for you and one for the spouse, from all the possibilities you''ll find on a farm...', 2007, 1, 5, '02:30:00', '00:30:00', '02:30:00', 12, 78591, 1300, 1150, 11122, 36, 7.93, 7.81, 66093, 'https://cf.geekdo-images.com/dDDo2Hexl80ucK1IlqTk-g__micro/img/SZgGqufNqaW8BCFT29wkYPaRXOE=/fit-in/64x64/filters:strip_icc()/pic831744.jpg');

-- Categorie (10 categories from details.csv)
INSERT INTO Categorie (Name) VALUES
('Medical'),
('City Building'),
('Economic'),
('Ancient'),
('Card Game'),
('Farming'),
('Trains'),
('Deduction'),
('Science Fiction'),
('Territory Building');

-- Mechaniques (10 mechanics from details.csv)
INSERT INTO Mechaniques (Name) VALUES
('Action Points'),
('Tile Placement'),
('Hand Management'),
('Set Collection'),
('Drafting'),
('Variable Player Powers'),
('Network and Route Building'),
('Cooperative Game'),
('Dice Rolling'),
('Worker Placement');

-- Famille (10 families from details.csv)
INSERT INTO Famille (Name) VALUES
('Game: Pandemic'),
('Game: Carcassonne'),
('Game: Catan'),
('Game: 7 Wonders'),
('Game: Dominion'),
('Game: Ticket to Ride (Official)'),
('Game: Codenames'),
('Game: Terraforming Mars'),
('Game: Agricola'),
('Game: 7 Wonders Duel');

-- Extension (10, using expansions from details.csv, assign to first 10 games)
INSERT INTO Extension (Name, JeuID) VALUES
('Pandemic: In the Lab', 1),
('Carcassonne: Expansion 1 – Inns & Cathedrals', 2),
('Catan: Seafarers', 3),
('7 Wonders: Leaders', 4),
('Dominion: Intrigue (Second Edition)', 5),
('Ticket to Ride: Europe', 6),
('Codenames: Blizzard Edition', 7),
('Terraforming Mars: Prelude', 8),
('7 Wonders Duel: Agora', 9),
('Agricola: Farmers of the Moor', 10);

-- Implementation (10, using implementations from details.csv, assign to first 10 games)
INSERT INTO Implementation (Name, JeuID) VALUES
('Pandemic Legacy: Season 1', 1),
('Carcassonne Junior', 2),
('Catan: Family Edition', 3),
('7 Wonders Duel', 4),
('Dominion (Second Edition)', 5),
('Ticket to Ride: London', 6),
('Codenames: Blizzard Edition', 7),
('Terraforming Mars: Ares Expedition', 8),
('7 Wonders (Second Edition)', 9),
('Agricola (Revised Edition)', 10);

-- Designer (10 designers from details.csv)
INSERT INTO Designer (Name) VALUES
('Matt Leacock'),
('Klaus-Jürgen Wrede'),
('Klaus Teuber'),
('Antoine Bauza'),
('Donald X. Vaccarino'),
('Alan R. Moon'),
('Vlaada Chvátil'),
('Jacob Fryxelius'),
('Uwe Rosenberg'),
('Bruno Cathala');

-- Artiste (10 artists from details.csv)
INSERT INTO Artiste (Name) VALUES
('Josh Cappel'),
('Doris Matthäus'),
('Volkan Baga'),
('Dimitri Chappuis'),
('Matthias Catrein'),
('Cyrille Daujean'),
('Stéphane Gantiez'),
('Isaac Fryxelius'),
('Klemens Franz'),
('Miguel Coimbra');

-- Avis (10 reviews, 1 per user for first 10 games, note: Note is arbitrary)
INSERT INTO Avis (Contenu, Note, JeuID, UserID) VALUES
('Great game!', 9, 1, 1),
('Classic!', 8, 2, 2),
('Fun with friends', 7, 3, 3),
('Strategic', 8, 4, 4),
('Replayable', 9, 5, 5),
('Family favorite', 8, 6, 6),
('Party hit', 7, 7, 7),
('Deep strategy', 10, 8, 8),
('Excellent 2p', 8, 9, 9),
('Challenging', 9, 10, 10);

-- Commentaire (10 comments, 1 per user for first 10 avis)
INSERT INTO Commentaire (Contenu, AvisID, UserID) VALUES
('I agree!', 1, 2),
('Totally!', 2, 3),
('Nice review', 3, 4),
('Good point', 4, 5),
('Absolutely', 5, 6),
('Well said', 6, 7),
('So true', 7, 8),
('Love it', 8, 9),
('Great insight', 9, 10),
('Thanks for sharing', 10, 1);

-- DesignJeu (link first 10 games to their main designer)
INSERT INTO DesignJeu (JeuID, DesignerID) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 10),
(10, 9);

-- CategorieJeu (assign 1 category per game, first 10)
INSERT INTO CategorieJeu (JeuID, CategorieID) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 7),
(7, 8),
(8, 9),
(9, 4),
(10, 6);

-- FamillesJeu (assign 1 family per game, first 10)
INSERT INTO FamillesJeu (JeuID, FamilleID) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 10),
(10, 9);

-- MechaniquesJeu (assign 1 mechanic per game, first 10)
INSERT INTO MechaniquesJeu (JeuID, MechaniquesID) VALUES
(1, 1),
(2, 2),
(3, 7),
(4, 5),
(5, 3),
(6, 7),
(7, 4),
(8, 5),
(9, 4),
(10, 10);

-- ArtisteJeu (assign 1 artist per game, first 10)
INSERT INTO ArtisteJeu (JeuID, ArtistID) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 10),
(10, 9);

-- CreationJeu (assign each user as creator of their corresponding game, for 10 users/games)
INSERT INTO CreationJeu (UserID, JeuID) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 9),
(10, 10);

-- JeuFavoriUser (each user favorites their corresponding game, for 10 users/games)
INSERT INTO JeuFavoriUser (UserID, JeuID) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 9),
(10, 10);

