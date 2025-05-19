import React, { useEffect, useState } from 'react';
import { Typography, Button, Table, message, Spin } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

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
      const res = await api.get(`/api/jeux-crees-par/${user.id}`);
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

  const columns = [
    { title: 'Nom', dataIndex: 'Nom', key: 'Nom' },
    { title: 'Âge min', dataIndex: 'MinAge', key: 'MinAge' },
    { title: 'Âge max', dataIndex: 'MaxAge', key: 'MaxAge' },
    { title: 'Joueurs min', dataIndex: 'MinPlayers', key: 'MinPlayers' },
    { title: 'Joueurs max', dataIndex: 'MaxPlayers', key: 'MaxPlayers' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, jeu) => (
        <Button
          icon={<EditOutlined />}
          onClick={() => navigate(`/edit-game/${jeu.JeuID}`)}
        >
          Modifier
        </Button>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 900, margin: '32px auto' }}>
      <Title level={2}>Mes Jeux Créés</Title>
      {loading ? (
        <Spin />
      ) : (
        <Table
          dataSource={jeux}
          columns={columns}
          rowKey="JeuID"
          pagination={false}
        />
      )}
    </div>
  );
}

export default MesJeux;
