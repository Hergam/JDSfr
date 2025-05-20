import React, { useEffect, useState } from 'react';
import { Typography, message, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import GamesList from '../components/GamesList';

const { Title } = Typography;

function MesJeux() {
  const [loading, setLoading] = useState(true);
  const [jeux, setJeux] = useState([]);
  const navigate = useNavigate();

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    if (!user) {
      message.warning("Vous devez être connecté.");
      navigate('/login');
      return;
    }
    fetchJeux();
    // eslint-disable-next-line
  }, []);

  const fetchJeux = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/jeux-crees/${user.id}`);
      if (res.data.success) {
        setJeux(res.data.data);
      } else {
        setJeux([]);
      }
    } catch {
      setJeux([]);
      message.error("Erreur lors du chargement de vos jeux.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '32px auto' }}>
      <Title level={2}>Mes Jeux Créés</Title>
      {loading ? (
        <Spin />
      ) : (
        <GamesList
          games={jeux}
          loading={loading}
        />
      )}
    </div>
  );
}

export default MesJeux;
