import React, { useEffect, useState } from 'react';
import { Typography, Carousel, message, Button, Tooltip } from 'antd';
import { StarOutlined, StarFilled } from '@ant-design/icons';
import GamesList from '../components/GamesList';
import api from '../services/api';

const { Title, Paragraph } = Typography;

function Home() {
  const carouselStyle = {
    height: '300px',
    color: '#fff',
    lineHeight: '300px',
    textAlign: 'center',
    background: '#364d79',
    marginBottom: 24,
  };

  const [favorites, setFavorites] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get user from localStorage
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    fetchGames();
    if (user) fetchFavorites();
    // eslint-disable-next-line
  }, []);

  const fetchGames = async () => {
    try {
      const res = await api.get('/api/games');
      if (res.data.success) setGames(res.data.data);
    } catch {
      message.error("Erreur lors du chargement des jeux");
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const res = await api.get(`/api/user-favorites/${user.id}`);
      if (res.data.success) {
        setFavorites(res.data.data.map(j => j.JeuID));
      }
    } catch {
      setFavorites([]);
    }
  };

  const handleFavorite = async (jeuId, isFav) => {
    if (!user) {
      message.warning("Connectez-vous pour ajouter aux favoris");
      return;
    }
    try {
      if (isFav) {
        await api.delete('/api/remove-favorite', { data: { userId: user.id, jeuId } });
        setFavorites(favorites.filter(id => id !== jeuId));
        message.success("Jeu retiré des favoris");
      } else {
        await api.post('/api/add-favorite', { userId: user.id, jeuId });
        setFavorites([...favorites, jeuId]);
        message.success("Jeu ajouté aux favoris");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        message.error(err.response.data.error);
      } else {
        message.error("Erreur lors de la gestion des favoris");
      }
    }
  };

  return (
    <div className="home-page">
      <Typography>
        <Title>Bienvenue sur JDSfr</Title>
        <Paragraph>
          Votre plateforme ultime de jeux de société - découvrez, évaluez et partagez vos jeux préférés !
        </Paragraph>
      </Typography>

      <Carousel autoplay>
        <div>
          <h3 style={carouselStyle}>Découvrez de Nouveaux Jeux</h3>
        </div>
        <div>
          <h3 style={carouselStyle}>Partagez Vos Favoris</h3>
        </div>
        <div>
          <h3 style={carouselStyle}>Connectez-vous Avec D'autres Joueurs</h3>
        </div>
      </Carousel>

      {/* Liste des jeux avec bouton favoris */}
      <div style={{ marginTop: 32 }}>
        <GamesList
          games={games}
          loading={loading}
          renderActions={jeu => user && (
            <Tooltip title={favorites.includes(jeu.JeuID) ? "Retirer des favoris" : "Ajouter aux favoris"}>
              <Button
                type="text"
                icon={favorites.includes(jeu.JeuID) ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />}
                onClick={e => {
                  e.stopPropagation();
                  handleFavorite(jeu.JeuID, favorites.includes(jeu.JeuID));
                }}
              />
            </Tooltip>
          )}
        />
      </div>
    </div>
  );
}

export default Home;
