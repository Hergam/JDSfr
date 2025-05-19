import React, { useEffect, useState } from 'react';
import { Typography, Carousel, message, Button, Tooltip, Form, Select, InputNumber, Slider, Row, Col, Input, Card } from 'antd';
import { StarOutlined, StarFilled, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
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
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    categorie_ids: [],
    age: null,
    duree: null,
    note: null,
    search: '',
    order_by: 'Nom_ASC'
  });

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
    fetchCategories();
    if (user) fetchFavorites();
    // eslint-disable-next-line
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/api/categories');
      if (res.data.success) setCategories(res.data.data);
    } catch {
      setCategories([]);
    }
  };

  const fetchGames = async (customFilters = filters) => {
    try {
      // Construction de la query string pour les filtres
      const params = new URLSearchParams();
      if (customFilters.categorie_ids && customFilters.categorie_ids.length > 0) {
        params.append('categorie_ids', customFilters.categorie_ids.join(','));
      }
      if (customFilters.age) params.append('age', customFilters.age);
      if (customFilters.duree) params.append('duree', customFilters.duree);
      if (customFilters.note) params.append('note', customFilters.note);
      if (customFilters.search) params.append('search', customFilters.search);
      if (customFilters.order_by) params.append('order_by', customFilters.order_by);

      const res = await api.get('/api/games' + (params.toString() ? `?${params.toString()}` : ''));
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

  const handleFilterChange = (changed, all) => {
    const newFilters = { ...filters, ...changed };
    setFilters(newFilters);
  };

  const handleFilterSubmit = (values) => {
    setLoading(true);
    setFilters(values);
    fetchGames(values);
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

      {/* Barre de recherche et filtres */}
      <Card style={{ margin: '32px auto 24px auto', maxWidth: 900 }}>
        <Form
          layout="vertical"
          initialValues={filters}
          onValuesChange={handleFilterChange}
          onFinish={handleFilterSubmit}
        >
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item label="Recherche par nom" name="search">
                <Input placeholder="Nom du jeu" allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Catégories" name="categorie_ids">
                <Select
                  mode="multiple"
                  allowClear
                  placeholder="Toutes"
                  optionFilterProp="children"
                >
                  {categories.map(cat => (
                    <Select.Option key={cat.CategorieID} value={cat.CategorieID}>
                      {cat.Name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Âge minimum" name="age">
                <InputNumber min={1} max={99} style={{ width: '100%' }} placeholder="Ex: 8" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item label="Durée max (minutes)" name="duree">
                <InputNumber min={1} max={1440} style={{ width: '100%' }} placeholder="Ex: 60" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Note minimum" name="note">
                <Slider min={0} max={5} step={0.1} marks={{ 0: '0', 2.5: '2.5', 5: '5' }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Trier par" name="order_by">
                <Select>
                  <Select.Option value="Nom_ASC">Nom (A-Z)</Select.Option>
                  <Select.Option value="Nom_DESC">Nom (Z-A)</Select.Option>
                  <Select.Option value="Note_DESC">Note décroissante</Select.Option>
                  <Select.Option value="Note_ASC">Note croissante</Select.Option>
                  <Select.Option value="Duree_ASC">Durée croissante</Select.Option>
                  <Select.Option value="Duree_DESC">Durée décroissante</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={8} style={{ display: 'flex', alignItems: 'end' }}>
              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                  Rechercher
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* Trier par (hors de la barre de recherche) */}
      <div style={{ maxWidth: 900, margin: '0 auto 16px auto', textAlign: 'right' }}>
        <Form layout="inline">
          <Form.Item label="Trier par" style={{ marginBottom: 0 }}>
            <Select
              value={filters.order_by}
              style={{ minWidth: 180 }}
              onChange={val => {
                const newFilters = { ...filters, order_by: val };
                setFilters(newFilters);
                setLoading(true);
                fetchGames(newFilters);
              }}
            >
              <Select.Option value="Nom_ASC">Nom (A-Z)</Select.Option>
              <Select.Option value="Nom_DESC">Nom (Z-A)</Select.Option>
              <Select.Option value="Note_DESC">Note décroissante</Select.Option>
              <Select.Option value="Note_ASC">Note croissante</Select.Option>
              <Select.Option value="Duree_ASC">Durée croissante</Select.Option>
              <Select.Option value="Duree_DESC">Durée décroissante</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </div>

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
