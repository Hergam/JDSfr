import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Typography, Form, Input, Button, Select, message, Spin, Slider, InputNumber } from 'antd';
import api from '../services/api';

const { Title } = Typography;

function EditGame() {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [game, setGame] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [playersRange, setPlayersRange] = useState([2, 4]);
  const [playingTime, setPlayingTime] = useState(60);
  const [minAge, setMinAge] = useState(8);
  const navigate = useNavigate();
  const { jeuId } = useParams();

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    if (!user || (user.statut !== 'Editeur' && user.statut !== 'Admin')) {
      message.error("Accès réservé aux éditeurs.");
      navigate('/');
      return;
    }
    fetchCategories();
    fetchGame();
    // eslint-disable-next-line
  }, [jeuId]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/api/categories');
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch {
      message.error("Impossible de charger les catégories");
    }
  };

  const fetchGame = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/games/${jeuId}`);
      if (res.data.success) {
        setGame(res.data.data);
        setPlayersRange([res.data.data.MinPlayers, res.data.data.MaxPlayers]);
        setPlayingTime(res.data.data.PlayingTime ? parseInt(res.data.data.PlayingTime.split(':')[0], 10) * 60 + parseInt(res.data.data.PlayingTime.split(':')[1], 10) : 60);
        setMinAge(res.data.data.MinAge || 8);
        // Récupérer les catégories du jeu
        const catRes = await api.get(`/api/game-full-details/${jeuId}`);
        if (catRes.data && catRes.data.categories) {
          setSelectedCategories(catRes.data.categories.map(c => c.CategorieID));
        }
        form.setFieldsValue({
          nom: res.data.data.Nom,
          description: res.data.data.description,
        });
      } else {
        message.error("Jeu non trouvé");
        navigate('/mes-jeux');
      }
    } catch {
      message.error("Erreur lors du chargement du jeu");
      navigate('/mes-jeux');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      let playingTimeStr = null;
      if (playingTime !== undefined && playingTime !== null) {
        const min = parseInt(playingTime, 10) || 0;
        const h = Math.floor(min / 60);
        const m = min % 60;
        playingTimeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:00`;
      }
      // Met à jour le jeu principal
      await api.put(`/api/games/${jeuId}`, {
        nom: values.nom,
        description: values.description,
        age_min: minAge,
        min_players: playersRange[0],
        max_players: playersRange[1],
        playing_time: playingTimeStr,
        categorie_ids: selectedCategories
      });
      message.success('Jeu modifié avec succès !');
      navigate('/mes-jeux');
    } catch (err) {
      message.error("Erreur lors de la modification du jeu");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !game) {
    return <div style={{ textAlign: 'center', padding: 50 }}><Spin /></div>;
  }

  return (
    <Card style={{ maxWidth: 600, margin: '40px auto' }}>
      <Title level={2}>Modifier le jeu</Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          nom: game.Nom,
          description: game.description,
        }}
      >
        <Form.Item
          label="Nom du jeu"
          name="nom"
          rules={[{ required: true, message: 'Veuillez entrer le nom du jeu' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Veuillez entrer une description' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          label="Nombre de joueurs (min - max)"
        >
          <Slider
            range
            min={1}
            max={20}
            marks={{ 1: '1', 2: '2', 4: '4', 6: '6', 8: '8', 10: '10', 20: '20+' }}
            tooltip={{ open: true }}
            value={playersRange}
            onChange={setPlayersRange}
          />
        </Form.Item>
        <Form.Item
          label="Âge recommandé (min)"
        >
          <Slider
            min={1}
            max={99}
            marks={{ 3: '3', 6: '6', 8: '8', 12: '12', 16: '16', 18: '18', 99: '99+' }}
            tooltip={{ open: true }}
            range={false}
            trackStyle={{ backgroundColor: '#d9d9d9' }}
            railStyle={{ backgroundColor: '#d9d9d9' }}
            value={minAge}
            onChange={setMinAge}
          />
        </Form.Item>
        <Form.Item
          label="Durée de jeu (minutes)"
        >
          <InputNumber
            min={1}
            max={1440}
            style={{ width: '100%' }}
            value={playingTime}
            onChange={setPlayingTime}
            placeholder="Ex: 60"
          />
        </Form.Item>
        <Form.Item
          label="Catégories"
        >
          <Select
            mode="multiple"
            placeholder="Sélectionnez une ou plusieurs catégories"
            optionFilterProp="children"
            value={selectedCategories}
            onChange={setSelectedCategories}
          >
            {categories.map(cat => (
              <Select.Option key={cat.CategorieID} value={cat.CategorieID}>
                {cat.Name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting}>
            Enregistrer les modifications
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

export default EditGame;
