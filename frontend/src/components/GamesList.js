import React, { useState, useEffect } from 'react';
import { List, Card, Typography, Spin, Empty, message, Tag, Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import api from '../services/api';

const { Title } = Typography;

function GamesList({ games = [], loading = false, renderActions }) {
  const [fetchedGames, setFetchedGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Ne pas fetcher tous les jeux si une liste est passée en props
  useEffect(() => {
    if (!games || games.length === 0) {
      fetchGames();
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line
  }, [games]);

  const fetchGames = async () => {
    try {
      const response = await api.get('/api/games');
      if (response.data.success) {
        setFetchedGames(response.data.data);
      } else {
        message.error("Erreur lors du chargement des jeux");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des jeux:", error);
      message.error("Impossible de charger les jeux");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || isLoading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
  }

  const gamesToRender = games.length > 0 ? games : fetchedGames;

  return (
    <div className="games-list">
      {gamesToRender.length === 0 ? (
        <Empty description="Aucun jeu disponible" />
      ) : (
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 4,
            xl: 4,
            xxl: 6,
          }}
          dataSource={gamesToRender}
          renderItem={(game) => (
            <List.Item>
              <Card 
                hoverable
                cover={
                  game.ImageURL ? (
                    <img 
                      alt={game.Nom} 
                      src={game.ImageURL} 
                      style={{ 
                        height: 200, 
                        objectFit: 'contain',
                        margin: '0 auto',
                        padding: '10px'
                      }} 
                    />
                  ) : (
                    <div style={{ 
                      height: 200, 
                      background: '#f5f5f5', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}>
                      Image du jeu
                    </div>
                  )
                }
                title={game.Nom || "Jeu sans nom"}
                actions={[]}
              >
                <div className="game-info">
                  <p><strong>Âge minimum:</strong> {game.MinAge || "?"} ans</p>
                  <p><strong>Joueurs:</strong> {game.MinPlayers || "?"} - {game.MaxPlayers || "?"}</p>
                  {game.Average && (
                    <Tag color="blue">Note: {game.Average}</Tag>
                  )}
                </div>
                {/* Boutons centrés, "Détails" puis actions personnalisées en colonne en dessous */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginTop: 16 }}>
                  <Link to={`/game/${game.JeuID}`}>
                    <Button type="primary" style={{ width: 120 }}>Détails</Button>
                  </Link>
                  {renderActions && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 120 }}>
                      {renderActions(game)}
                    </div>
                  )}
                </div>
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
}

export default GamesList;