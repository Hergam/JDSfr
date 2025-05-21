import express from 'express';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());

// Configure CORS
app.use(cors({
  origin: '*',  // Allow requests from any origin during development
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT
});

// 0. Misc/Test
app.get('/api/test', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT NOW() AS now');
    res.json({ success: true, time: rows[0].now });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 1. Auth
app.post('/register', async (req, res) => {
  const { username, password, email, statut } = req.body;
  if (!username || !password || !email || !statut) {
    return res.status(400).json({ success: false, error: 'Missing fields' });
  }
  try {
    // Check if email already exists
    const [existing] = await pool.query('SELECT UserID FROM Utilisateur WHERE Email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, error: 'Email already registered' });
    }
    // Store password in plain text
    await pool.query(
      'INSERT INTO Utilisateur (Nom, Password, Email, Statut) VALUES (?, ?, ?, ?)',
      [username, password, email, statut]
    );
    res.json({ success: true, message: 'User registered' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Missing fields' });
  }
  
  try {
    // Explicitly specify all needed columns
    const [users] = await pool.query('SELECT UserID, Nom, Email, Password, Statut FROM Utilisateur WHERE Email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    const user = users[0];
    
    // Simple direct password comparison
    if (password !== user.Password) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    // Return user info (excluding password)
    res.json({
      success: true,
      user: {
        id: user.UserID,
        username: user.Nom,
        email: user.Email,
        statut: user.Statut
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. User Profile
app.get('/api/user/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const [rows] = await pool.query(
      'SELECT UserID, Nom AS username, Email, Statut FROM Utilisateur WHERE UserID = ?',
      [userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, user: rows[0] });
  } catch (err) {
    console.error("Erreur dans /api/user/:userId :", err); // Affiche l'objet d'erreur complet
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/user/:userId', async (req, res) => {
  const userId = req.params.userId;
  const { username, email, statut } = req.body;
  if (!username || !email || !statut) {
    return res.status(400).json({ success: false, error: 'Missing fields' });
  }
  try {
    await pool.query(
      'UPDATE Utilisateur SET Nom = ?, Email = ?, Statut = ? WHERE UserID = ?',
      [username, email, statut, userId]
    );
    res.json({ success: true, message: 'User profile updated' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/add-user', async (req, res) => {
  const { username, password, email, statut } = req.body;
  if (!username || !password || !email || !statut) {
    return res.status(400).json({ success: false, error: 'Missing fields' });
  }
  try {
    // Store password as plain text when calling the procedure
    await pool.query('CALL AddNewUser(?, ?, ?, ?)', [username, password, email, statut]);
    res.json({ success: true, message: 'User added via procedure' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin routes
app.get('/api/admin/users', async (req, res) => {
  // Check if user is admin
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, error: 'Authorization required' });
  }

  try {
    const userId = parseInt(authHeader.split(' ')[1]);
    const [admins] = await pool.query(
      'SELECT UserID FROM Utilisateur WHERE UserID = ? AND Statut = "Admin"',
      [userId]
    );
    
    if (admins.length === 0) {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }
    
    // Get all users
    const [users] = await pool.query('SELECT UserID, Nom, Email, Statut FROM Utilisateur');
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/admin/users/:userId', async (req, res) => {
  const targetUserId = req.params.userId;
  const { statut } = req.body;
  
  // Check if user is admin
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, error: 'Authorization required' });
  }

  try {
    const adminId = parseInt(authHeader.split(' ')[1]);
    const [admins] = await pool.query(
      'SELECT UserID FROM Utilisateur WHERE UserID = ? AND Statut = "Admin"',
      [adminId]
    );
    
    if (admins.length === 0) {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }
    
    // Update user status
    await pool.query(
      'UPDATE Utilisateur SET Statut = ? WHERE UserID = ?',
      [statut, targetUserId]
    );
    
    res.json({ success: true, message: 'User status updated' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/admin/users/:userId', async (req, res) => {
  const targetUserId = req.params.userId;
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, error: 'Authorization required' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const adminId = parseInt(authHeader.split(' ')[1]);
    const [admins] = await conn.query(
      'SELECT UserID FROM Utilisateur WHERE UserID = ? AND Statut = "Admin"',
      [adminId]
    );
    if (admins.length === 0) {
      await conn.rollback();
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }

    await conn.query(
      `DELETE FROM Commentaire WHERE UserID = ?`,
      [targetUserId]
    );
    await conn.query(
      `DELETE FROM Avis WHERE UserID = ?`,
      [targetUserId]
    );
    await conn.query(
      `DELETE FROM CreationJeu WHERE UserID = ?`,
      [targetUserId]
    );
    await conn.query(
      `DELETE FROM JeuFavoriUser WHERE UserID = ?`,
      [targetUserId]
    );

    await conn.query('DELETE FROM Utilisateur WHERE UserID = ?', [targetUserId]);

    await conn.commit();
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    await conn.rollback();
    console.error("Erreur lors de la deletion de l'utilisateur :", err.message);
    res.status(500).json({ success: false, error: err.message });
  } finally {
    conn.release();
  }
});

// 3. Game Management
app.get('/api/games', async (req, res) => {
  try {
    const { categorie_ids, age, duree, note, search, order_by } = req.query;
    let sql = 'SELECT DISTINCT j.* FROM Jeu j';
    const params = [];
    let joins = '';
    let wheres = [];

    if (categorie_ids) {
      joins += ' JOIN CategorieJeu cj ON j.JeuID = cj.JeuID';
      const ids = categorie_ids.split(',').map(Number).filter(Boolean);
      if (ids.length > 0) {
        wheres.push(`cj.CategorieID IN (${ids.map(() => '?').join(',')})`);
        params.push(...ids);
      }
    }
    if (age) {
      wheres.push('j.MinAge <= ?');
      params.push(Number(age));
    }
    if (duree) {
      wheres.push('j.PlayingTime IS NOT NULL AND j.PlayingTime <= SEC_TO_TIME(? * 60)');
      params.push(Number(duree));
    }
    if (note) {
      const noteValue = Math.min(Number(note), 5);
      wheres.push('j.Average >= ?');
      params.push(noteValue);
    }
    if (search) {
      wheres.push('j.Nom LIKE ?');
      params.push(`%${search}%`);
    }

    if (joins) sql += joins;
    if (wheres.length > 0) sql += ' WHERE ' + wheres.join(' AND ');

    // Ajout du tri dynamique
    let orderSql = '';
    switch (order_by) {
      case 'Nom_DESC':
        orderSql = ' ORDER BY j.Nom DESC';
        break;
      case 'Note_DESC':
        orderSql = ' ORDER BY j.Average DESC';
        break;
      case 'Note_ASC':
        orderSql = ' ORDER BY j.Average ASC';
        break;
      case 'Duree_ASC':
        orderSql = ' ORDER BY j.PlayingTime ASC';
        break;
      case 'Duree_DESC':
        orderSql = ' ORDER BY j.PlayingTime DESC';
        break;
      default:
        orderSql = ' ORDER BY j.Nom ASC';
    }
    sql += orderSql;

    const [rows] = await pool.query(sql, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Route pour récupérer un jeu spécifique par ID
app.get('/api/games/:id', async (req, res) => {
  const gameId = req.params.id;
  try {
    // Récupère le jeu et le créateur (nom et id)
    const [rows] = await pool.query(
      `SELECT j.*, u.UserID AS CreateurID, u.Nom AS CreateurNom
       FROM Jeu j
       LEFT JOIN CreationJeu cj ON j.JeuID = cj.JeuID
       LEFT JOIN Utilisateur u ON cj.UserID = u.UserID
       WHERE j.JeuID = ?`,
      [gameId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Jeu non trouvé' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/games', async (req, res) => {
  const { nom, description, age_min, min_players, max_players, playing_time, categorie_ids, createur_id } = req.body;
  if (!nom || !description || age_min == null || min_players == null || max_players == null || !playing_time || !categorie_ids || !Array.isArray(categorie_ids) || categorie_ids.length === 0 || !createur_id) {
    console.error('Missing fields in POST /api/games:', req.body);
    return res.status(400).json({ success: false, error: 'Missing fields' });
  }
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.query(
      'INSERT INTO Jeu (Nom, description, MinAge, MinPlayers, MaxPlayers, PlayingTime) VALUES (?, ?, ?, ?, ?, ?)',
      [nom, description, age_min, min_players, max_players, playing_time]
    );
    const jeuId = result.insertId;

    for (const catId of categorie_ids) {
      await conn.query(
        'INSERT INTO CategorieJeu (JeuID, CategorieID) VALUES (?, ?)',
        [jeuId, catId]
      );
    }

    await conn.query(
      'INSERT INTO CreationJeu (UserID, JeuID) VALUES (?, ?)',
      [createur_id, jeuId]
    );

    await conn.commit();
    res.json({ success: true, message: 'Game added' });
  } catch (err) {
    await conn.rollback();
    if (
      err.code === 'ER_SIGNAL_EXCEPTION' ||
      (err.errno === 1644) ||
      (err.sqlState === '45000') ||
      (err.message && (
        err.message.includes('Seuls les éditeurs') ||
        err.message.includes('a déjà noté ce jeu') ||
        err.message.includes('Cannot add or update a child row') ||
        err.message.includes('a foreign key constraint fails')
      ))
    ) {
      return res.status(403).json({ success: false, error: err.message });
    }
    console.error('Error in POST /api/games:', err);
    res.status(500).json({ success: false, error: err.message });
  } finally {
    conn.release();
  }
});

app.put('/api/games/:jeuId', async (req, res) => {
  const jeuId = req.params.jeuId;
  const { nom, description, age_min, min_players, max_players, playing_time, categorie_ids } = req.body;
  if (!nom || !description || !age_min || min_players == null || max_players == null || !playing_time || !categorie_ids || !Array.isArray(categorie_ids) || categorie_ids.length === 0) {
    console.log('missing fields in put /api/games/:jeuId :', req.body);
    return res.status(400).json({ success: false, error: 'Missing fields' });
  }
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Met à jour les champs principaux du jeu
    await conn.query(
      'UPDATE Jeu SET Nom = ?, Description = ?, MinAge = ?, MinPlayers = ?, MaxPlayers = ?, PlayingTime = ? WHERE JeuID = ?',
      [nom, description, age_min, min_players, max_players, playing_time, jeuId]
    );

    // Met à jour les catégories (remplace toutes les anciennes par les nouvelles)
    await conn.query('DELETE FROM CategorieJeu WHERE JeuID = ?', [jeuId]);
    for (const catId of categorie_ids) {
      await conn.query(
        'INSERT INTO CategorieJeu (JeuID, CategorieID) VALUES (?, ?)',
        [jeuId, catId]
      );
    }

    await conn.commit();
    res.json({ success: true, message: 'Game updated' });
  } catch (err) {
    await conn.rollback();
    console.error('Error in put /api/games/:jeuId :', err);
    res.status(500).json({ success: false, error: err.message });
  } finally {
    conn.release();
  }
});

app.delete('/api/games/:jeuId', async (req, res) => {
  const jeuId = req.params.jeuId;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query('DELETE FROM Commentaire WHERE AvisID IN (SELECT AvisID FROM Avis WHERE JeuID = ?)', [jeuId]);
    await conn.query('DELETE FROM Avis WHERE JeuID = ?', [jeuId]);
    await conn.query('DELETE FROM CreationJeu WHERE JeuID = ?', [jeuId]);
    await conn.query('DELETE FROM JeuFavoriUser WHERE JeuID = ?', [jeuId]);
    await conn.query('DELETE FROM CategorieJeu WHERE JeuID = ?', [jeuId]);
    await conn.query('DELETE FROM FamillesJeu WHERE JeuID = ?', [jeuId]);
    await conn.query('DELETE FROM MechaniquesJeu WHERE JeuID = ?', [jeuId]);
    await conn.query('DELETE FROM ArtisteJeu WHERE JeuID = ?', [jeuId]);
    await conn.query('DELETE FROM DesignJeu WHERE JeuID = ?', [jeuId]);
    await conn.query('DELETE FROM Extension WHERE JeuID = ?', [jeuId]);
    await conn.query('DELETE FROM Implementation WHERE JeuID = ?', [jeuId]);
    await conn.query('DELETE FROM Jeu WHERE JeuID = ?', [jeuId]);

    await conn.commit();
    res.json({ success: true, message: 'Game deleted' });
  } catch (err) {
    await conn.rollback();
    console.error("Erreur lors de la deletion du jeu :", err.message);
    res.status(500).json({ success: false, error: err.message });
  } finally {
    conn.release();
  }
});

app.get('/api/game-full-details/:jeuId', async (req, res) => {
  const jeuId = req.params.jeuId;
  try {
    const [results] = await pool.query('CALL GetGameFullDetails(?)', [jeuId]);
    // MySQL returns an array of result sets, one for each SELECT in the procedure
    res.json({
      success: true,
      designers: results[0],
      categories: results[1],
      familles: results[2],
      mechaniques: results[3],
      artistes: results[4],
      extensions: results[5],
      implementations: results[6],
      avis: results[7],
      commentaires: results[8]
    });
  } catch (err) {
    console.error("Erreur lors de la requete de gamefulldetails :", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/jeux-disponibles', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Vue_JeuxDisponibles');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/games-by-age-range', async (req, res) => {
  const min_age = parseInt(req.query.min_age, 10);
  const max_age = parseInt(req.query.max_age, 10);
  if (isNaN(min_age) || isNaN(max_age)) {
    return res.status(400).json({ success: false, error: 'Missing or invalid min_age or max_age' });
  }
  try {
    const [rows] = await pool.query('CALL GetGamesByAgeRange(?, ?)', [min_age, max_age]);
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/jeux-crees/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    // Utilise la procédure stockée pour récupérer la liste des jeux créés par l'utilisateur
    const [rows] = await pool.query('CALL GetJeuxCreatedByUser(?)', [userId]);
    // rows[0] contient la liste des jeux
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Categorie');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Favorites Management
app.post('/api/add-favorite', async (req, res) => {
  const { userId, jeuId } = req.body;
  if (!userId || !jeuId) {
    return res.status(400).json({ success: false, error: 'Missing fields' });
  }
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('CALL AddFavoriteGame(?, ?)', [userId, jeuId]);
    await conn.commit();
    res.json({ success: true, message: 'Favorite game added' });
  } catch (err) {
    await conn.rollback();
    if (
      err.code === 'ER_SIGNAL_EXCEPTION' ||
      (err.errno === 1644) ||
      (err.sqlState === '45000') ||
      (err.message && err.message.includes('plus de 20 jeux favoris'))
    ) {
      return res.status(403).json({ success: false, error: "Vous ne pouvez pas avoir plus de 20 jeux favoris." });
    }
    res.status(500).json({ success: false, error: err.message });
  } finally {
    conn.release();
  }
});

app.get('/api/user-favorites/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const [rows] = await pool.query('CALL GetUsersFavoriteGames(?)', [userId]);
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/remove-favorite', async (req, res) => {
  const { userId, jeuId } = req.body;
  if (!userId || !jeuId) {
    return res.status(400).json({ success: false, error: 'Missing fields' });
  }
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('DELETE FROM JeuFavoriUser WHERE UserID = ? AND JeuID = ?', [userId, jeuId]);
    await conn.commit();
    res.json({ success: true, message: 'Favorite removed' });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ success: false, error: err.message });
  } finally {
    conn.release();
  }
});

// 5. Reviews Management
app.post('/api/add-review', async (req, res) => {
  const { contenu, note, jeuId, userId } = req.body;
  if (!contenu || !note || !jeuId || !userId) {
    return res.status(400).json({ success: false, error: 'Missing fields' });
  }
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('CALL AddReview(?, ?, ?, ?)', [contenu, note, jeuId, userId]);
    await conn.commit();
    res.json({ success: true, message: 'Review added' });
  } catch (err) {
    await conn.rollback();
    if (
      err.code === 'ER_SIGNAL_EXCEPTION' ||
      (err.errno === 1644) ||
      (err.sqlState === '45000') ||
      (err.message && err.message.includes('déjà noté ce jeu'))
    ) {
      return res.status(409).json({ success: false, error: "Vous avez déjà laissé un avis pour ce jeu." });
    }
    res.status(500).json({ success: false, error: err.message });
  } finally {
    conn.release();
  }
});

app.get('/api/reviews-for-game/:jeuId', async (req, res) => {
  const jeuId = req.params.jeuId;
  try {
    const [rows] = await pool.query('CALL GetReviewsForGame(?)', [jeuId]);
    // MySQL procedures return results as [rows, fields], rows[0] is the actual data
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/user-reviews/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const [rows] = await pool.query(
      `SELECT a.AvisID, a.Contenu, a.Note, a.JeuID, j.Nom AS JeuNom, a.DateAvis
       FROM Avis a
       JOIN Jeu j ON a.JeuID = j.JeuID
       WHERE a.UserID = ?`,
      [userId]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/review/:reviewId', async (req, res) => {
  const reviewId = req.params.reviewId;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('DELETE FROM Avis WHERE AvisID = ?', [reviewId]);
    await conn.commit();
    res.json({ success: true, message: 'Review deleted' });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ success: false, error: err.message });
  } finally {
    conn.release();
  }
});

app.get('/api/count-avis/:jeuId', async (req, res) => {
  const jeuId = req.params.jeuId;
  try {
    const [rows] = await pool.query('SELECT CountAvis(?) AS avis_count', [jeuId]);
    res.json({ success: true, avis_count: rows[0].avis_count });
  } catch (err) {
    res.status (500).json({ success: false, error: err.message });
  }
});

app.get('/api/average-note/:jeuId', async (req, res) => {
  const jeuId = req.params.jeuId;
  try {
    const [rows] = await pool.query('SELECT GetAverageNote(?) AS average_note', [jeuId]);
    res.json({ success: true, average_note: rows[0].average_note });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/avis-par-jeu', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Vue_AvisParJeu');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/age-moyen-categorie/:catId', async (req, res) => {
  const catId = req.params.catId;
  try {
    const [rows] = await pool.query('SELECT AgeMoyenCategorie(?) AS age_moyen', [catId]);
    res.json({ success: true, age_moyen: rows[0].age_moyen });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Récupérer le nombre de jeux créés par un utilisateur via la fonction stockée
app.get('/api/jeux-crees-par/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const [rows] = await pool.query('SELECT GetJeuxCreePar(?) AS nb_jeux', [userId]);
    res.json({ success: true, nb_jeux: rows[0].nb_jeux });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
