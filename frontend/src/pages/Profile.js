import React, { useEffect, useState } from 'react';
import { Card, Typography, Spin, List, Avatar, Tag, Divider, Button, message } from 'antd';
import { UserOutlined, StarFilled } from '@ant-design/icons';
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;

function Profile() {
  const [userInfo, setUserInfo] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Get user from localStorage
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    if (!user) {
      message.warning("Vous devez être connecté pour accéder à votre profil.");
      navigate('/login');
      return;
    }
    // Reset loading before fetching
    setLoading(true);
    Promise.all([fetchProfile(), fetchFavorites()]).finally(() => setLoading(false));
    // eslint-disable-next-line
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get(`/api/user/${user.id}`);
      if (res.data.success) setUserInfo(res.data.user);
      else setUserInfo(null);
    } catch {
      setUserInfo(null);
    }
  };

  const fetchFavorites = async () => {
    try {
      const res = await api.get(`/api/user-favorites/${user.id}`);
      if (res.data.success) setFavorites(res.data.data);
      else setFavorites([]);
    } catch {
      setFavorites([]);
    }
  };

  if (!userInfo || loading) {
    return <div style={{ textAlign: 'center', padding: 50 }}><Spin /></div>;
  }

  return (
    <div style={{ maxWidth: 800, margin: '40px auto' }}>
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
          <Avatar size={64} icon={<UserOutlined />} style={{ marginRight: 24 }} />
          <div>
            <Title level={3} style={{ marginBottom: 0 }}>{userInfo.username}</Title>
            <Text type="secondary">{userInfo.Email}</Text>
            <div>
              <Tag color="blue" style={{ marginTop: 8 }}>{userInfo.Statut}</Tag>
            </div>
          </div>
        </div>
        <Divider />
        <Title level={4}>Jeux favoris</Title>
        {favorites.length === 0 ? (
          <Paragraph>Aucun favori.</Paragraph>
        ) : (
          <List
            dataSource={favorites}
            renderItem={jeu => (
              <List.Item>
                <StarFilled style={{ color: '#faad14', marginRight: 8 }} />
                <Link to={`/game/${jeu.JeuID}`}>{jeu.Nom}</Link>
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
}

export default Profile;
