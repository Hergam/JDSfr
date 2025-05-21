import React, { useEffect, useState } from 'react';
import { Typography, message, Spin, Button, Popconfirm, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import GamesList from '../components/GamesList';

const { Title } = Typography;

function MesJeux() {
  const [loading, setLoading] = useState(true);
  const [jeux, setJeux] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
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

  const handleDelete = async (jeuId) => {
    setDeletingId(jeuId);
    try {
      await api.delete(`/api/games/${jeuId}`);
      message.success("Jeu supprimé avec succès");
      setJeux(jeux.filter(j => j.JeuID !== jeuId));
    } catch (err) {
      message.error("Erreur lors de la suppression du jeu");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (jeuId) => {
    navigate(`/edit-game/${jeuId}`);
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
          renderActions={(jeu) => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Button
                type="primary"
                onClick={() => handleEdit(jeu.JeuID)}
                disabled={deletingId === jeu.JeuID}
              >
                Modifier
              </Button>
              <Popconfirm
                title="Supprimer ce jeu ?"
                description="Cette action est irréversible."
                okText="Oui"
                cancelText="Non"
                onConfirm={() => handleDelete(jeu.JeuID)}
                okButtonProps={{ danger: true, loading: deletingId === jeu.JeuID }}
              >
                <Button danger loading={deletingId === jeu.JeuID}>
                  Supprimer
                </Button>
              </Popconfirm>
            </div>
          )}
        />
      )}
    </div>
  );
}

export default MesJeux;
