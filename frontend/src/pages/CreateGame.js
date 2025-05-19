import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Form, Input, Button, Select, message, Spin, Slider, InputNumber } from 'antd';
import api from '../services/api';

const { Title } = Typography;

function CreateGame() {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // Vérifie le statut utilisateur
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    if (!user || user.statut !== 'Editeur') {
      message.error("Accès réservé aux éditeurs.");
      navigate('/');
      return;
    }
    fetchCategories();
  // eslint-disable-next-line
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/api/categories');
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch {
      message.error("Impossible de charger les catégories");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      // Conversion minutes -> HH:MM:00
      let playingTime = null;
      if (values.playing_time !== undefined && values.playing_time !== null) {
        const min = parseInt(values.playing_time, 10) || 0;
        const h = Math.floor(min / 60);
        const m = min % 60;
        playingTime = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:00`;
      }
      await api.post('/api/games', {
        nom: values.nom,
        description: values.description,
        age_min: values.age_range[0],
        age_max: values.age_range[1],
        min_players: values.players_range[0],
        max_players: values.players_range[1],
        playing_time: playingTime,
        categorie_ids: values.categorie_ids,
        createur_id: user.id
      });
      message.success('Jeu créé avec succès !');
      navigate('/');
    } catch (err) {
      message.error("Erreur lors de la création du jeu");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 50 }}><Spin /></div>;
  }

  return (
    <Card style={{ maxWidth: 600, margin: '40px auto' }}>
      <Title level={2}>Créer un nouveau jeu</Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          age_range: [8, 99],
          players_range: [2, 4]
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
          name="players_range"
          rules={[{ required: true, message: 'Veuillez sélectionner le nombre de joueurs' }]}
        >
          <Slider
            range
            min={1}
            max={20}
            marks={{ 1: '1', 2: '2', 4: '4', 6: '6', 8: '8', 10: '10', 20: '20+' }}
            tooltip={{ open: true }}
          />
        </Form.Item>
        <Form.Item
          label="Âge recommandé (min - max)"
          name="age_range"
          rules={[{ required: true, message: 'Veuillez sélectionner la tranche d\'âge' }]}
        >
          <Slider
            range
            min={1}
            max={99}
            marks={{ 3: '3', 6: '6', 8: '8', 12: '12', 16: '16', 18: '18', 99: '99+' }}
            tooltip={{ open: true }}
          />
        </Form.Item>
        <Form.Item
          label="Durée de jeu (minutes)"
          name="playing_time"
          rules={[
            { required: true, message: 'Veuillez entrer la durée de jeu' },
            { type: 'number', min: 1, max: 1440, message: 'Durée entre 1 et 1440 minutes' }
          ]}
        >
          <InputNumber min={1} max={1440} style={{ width: '100%' }} placeholder="Ex: 60" />
        </Form.Item>
        <Form.Item
          label="Catégories"
          name="categorie_ids"
          rules={[{ required: true, message: 'Veuillez sélectionner au moins une catégorie' }]}
        >
          <Select
            mode="multiple"
            placeholder="Sélectionnez une ou plusieurs catégories"
            optionFilterProp="children"
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
            Créer le jeu
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

export default CreateGame;
