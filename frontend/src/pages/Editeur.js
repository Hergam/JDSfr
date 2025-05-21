import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Typography, Spin, List, Avatar, Divider, message, Button } from 'antd';
import { ArrowLeftOutlined, UserOutlined } from '@ant-design/icons';
import api from '../services/api';

const { Title, Text } = Typography;

function Editeur() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [games, setGames] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingGames, setLoadingGames] = useState(true);

  useEffect(() => {
    fetchUser();
    fetchGames();
    // eslint-disable-next-line
  }, [id]);

  const fetchUser = async () => {
    setLoadingUser(true);
    try {
      const res = await api.get(`/api/user/${id}`);
      if (res.data.success) {
        setUser(res.data.user);
      } else {
        message.error("Utilisateur non trouvé");
      }
    } catch {
      message.error("Erreur lors du chargement de l'utilisateur");
    } finally {
      setLoadingUser(false);
    }
  };

  const fetchGames = async () => {
    setLoadingGames(true);
    try {
      const res = await api.get(`/api/jeux-crees/${id}`);
      if (res.data.success) {
        setGames(res.data.data);
      } else {
        message.error("Erreur lors du chargement des jeux créés");
      }
    } catch {
      message.error("Erreur lors du chargement des jeux créés");
    } finally {
      setLoadingGames(false);
    }
  };

  if (loadingUser) {
    return <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>;
  }

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: 50 }}>
        <Title level={3}>Utilisateur non trouvé</Title>
        <Button type="primary" icon={<ArrowLeftOutlined />}>
          <Link to="/">Retour à l'accueil</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Button type="primary" icon={<ArrowLeftOutlined />} style={{ marginBottom: 20 }}>
        <Link to="/">Retour à l'accueil</Link>
      </Button>
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <Avatar size={64} icon={<UserOutlined />} style={{ marginRight: 20 }} />
          <div>
            <Title level={2} style={{ marginBottom: 0 }}>{user.username}</Title>
            <Text type="secondary">{user.Email}</Text>
            <br />
            <Text type="secondary">Statut : {user.Statut}</Text>
          </div>
        </div>
        <Divider orientation="left">Jeux créés</Divider>
        {loadingGames ? (
          <Spin />
        ) : games.length > 0 ? (
          <List
            itemLayout="horizontal"
            dataSource={games}
            renderItem={jeu => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    jeu.ImageURL ? (
                      <Avatar shape="square" src={jeu.ImageURL} />
                    ) : (
                      <Avatar shape="square" icon={<UserOutlined />} />
                    )
                  }
                  title={<Link to={`/game/${jeu.JeuID}`}>{jeu.Nom}</Link>}
                  description={jeu.description ? jeu.description.substring(0, 80) + (jeu.description.length > 80 ? '...' : '') : 'Pas de description.'}
                />
              </List.Item>
            )}
          />
        ) : (
          <Text>Aucun jeu créé par cet utilisateur.</Text>
        )}
      </Card>
    </div>
  );
}

export default Editeur;
