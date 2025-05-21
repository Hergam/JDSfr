import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Typography, Spin, Button, Descriptions, Divider, Row, Col, Tag, message, Statistic, List, Rate, Avatar, Form, Input } from 'antd';
import { ArrowLeftOutlined, UserOutlined, StarOutlined, StarFilled } from '@ant-design/icons';
import api from '../services/api';

const { Title, Paragraph, Text } = Typography;

function GameDetails() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [form] = Form.useForm();

  // Get user from localStorage
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    fetchGameDetails();
    fetchGameReviews();
    if (user) checkFavorite();
  }, [id]);

  const fetchGameDetails = async () => {
    try {
      const response = await api.get(`/api/games/${id}`);
      if (response.data.success) {
        setGame(response.data.data);
      } else {
        message.error("Erreur lors du chargement des détails du jeu");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des détails du jeu:", error);
      message.error("Impossible de charger les détails du jeu");
    } finally {
      setLoading(false);
    }
  };

  const fetchGameReviews = async () => {
    try {
      const response = await api.get(`/api/reviews-for-game/${id}`);
      if (response.data.success) {
        setReviews(response.data.data);
      } else {
        message.error("Erreur lors du chargement des avis");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des avis:", error);
      message.error("Impossible de charger les avis");
    } finally {
      setReviewsLoading(false);
    }
  };

  const checkFavorite = async () => {
    try {
      const res = await api.get(`/api/user-favorites/${user.id}`);
      if (res.data.success) {
        setIsFavorite(res.data.data.some(j => j.JeuID === parseInt(id)));
      }
    } catch {
      setIsFavorite(false);
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      message.warning("Connectez-vous pour ajouter aux favoris");
      return;
    }
    try {
      if (isFavorite) {
        await api.delete('/api/remove-favorite', { data: { userId: user.id, jeuId: id } });
        setIsFavorite(false);
        message.success("Jeu retiré des favoris");
      } else {
        await api.post('/api/add-favorite', { userId: user.id, jeuId: id });
        setIsFavorite(true);
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

  const handleReviewSubmit = async (values) => {
    setSubmitting(true);
    try {
      await api.post('/api/add-review', {
        contenu: values.contenu,
        note: values.note,
        jeuId: id,
        userId: user.id
      });
      message.success('Avis ajouté !');
      form.resetFields();
      fetchGameReviews();
    } catch (err) {
      // Affiche une erreur explicite si l'utilisateur a déjà laissé un avis
      if (err.response && err.response.status === 409) {
        message.error('Vous avez déjà laissé un avis pour ce jeu.');
      } else if (err.response && err.response.data && err.response.data.error) {
        message.error(`Erreur lors de l'ajout de l'avis : ${err.response.data.error}`);
      } else {
        message.error('Erreur lors de l\'ajout de l\'avis');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await api.delete(`/api/review/${reviewId}`);
      message.success('Avis supprimé.');
      fetchGameReviews();
    } catch (err) {
      message.error("Erreur lors de la suppression de l'avis");
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
  }

  if (!game) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Title level={3}>Jeu non trouvé</Title>
        <Button type="primary" icon={<ArrowLeftOutlined />}>
          <Link to="/">Retour à l'accueil</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="game-details">
      <Button 
        type="primary" 
        icon={<ArrowLeftOutlined />} 
        style={{ marginBottom: 20 }}
      >
        <Link to="/">Retour à la liste des jeux</Link>
      </Button>

      {/* Bouton favoris */}
      {user && (
        <Button
          type="text"
          icon={isFavorite ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />}
          onClick={handleFavorite}
          style={{ float: 'right', marginTop: -40, marginRight: 10 }}
        >
          {isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        </Button>
      )}

      <Card>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            {game.ImageURL ? (
              <img 
                alt={game.Nom} 
                src={game.ImageURL} 
                style={{ 
                  width: '100%', 
                  maxHeight: '400px',
                  objectFit: 'contain'
                }} 
              />
            ) : (
              <div style={{ 
                height: 300, 
                background: '#f5f5f5', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: 20 
              }}>
                Image non disponible
              </div>
            )}
          </Col>
          
          <Col xs={24} md={16}>
            <Title level={2}>{game.Nom}</Title>
            {/* Affichage du créateur */}
            {game.CreateurNom && (
              <div style={{ marginBottom: 12 }}>
                <Text type="secondary">
                  Créé par&nbsp;
                  {game.CreateurID ? (
                    <Link to={`/user/${game.CreateurID}`}>{game.CreateurNom}</Link>
                  ) : (
                    game.CreateurNom
                  )}
                </Text>
              </div>
            )}
            <Divider />

            <Descriptions bordered column={1}>
              <Descriptions.Item label="Année de publication">{game.YearPublished || "Non spécifiée"}</Descriptions.Item>
              <Descriptions.Item label="Âge minimum">{game.MinAge || "?"} ans</Descriptions.Item>
              <Descriptions.Item label="Nombre de joueurs">{game.MinPlayers || "?"} - {game.MaxPlayers || "?"}</Descriptions.Item>
              <Descriptions.Item label="Durée de jeu">{game.PlayingTime ? game.PlayingTime.substring(0, 5) : "?"} min</Descriptions.Item>
              {game.Average && <Descriptions.Item label="Note moyenne"><Tag color="blue">{game.Average}</Tag></Descriptions.Item>}
            </Descriptions>
          </Col>
        </Row>

        <Divider orientation="left">Description</Divider>
        <Paragraph style={{ fontSize: '16px', lineHeight: '1.6' }}>
          {game.description || "Aucune description disponible pour ce jeu."}
        </Paragraph>

        {/* Section pour les détails supplémentaires si disponibles */}
        <Divider orientation="left">Statistiques</Divider>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Card>
              <Statistic title="Possédé par" value={game.Owned || "N/A"} suffix="utilisateurs" />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Souhaité par" value={game.Wishing || "N/A"} suffix="utilisateurs" />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Recherché par" value={game.Wanting || "N/A"} suffix="utilisateurs" />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Rang" value={game.Rank_ || "N/A"} />
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Section des avis */}
      <Divider orientation="left" style={{ marginTop: 30 }}>
        <Title level={3}>Avis des joueurs</Title>
      </Divider>

      {/* Formulaire d'ajout d'avis pour utilisateur connecté */}
      {user && (
        <Card style={{ marginBottom: 24 }}>
          <Title level={4} style={{ marginBottom: 12 }}>Laisser un avis</Title>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleReviewSubmit}
          >
            <Form.Item
              name="note"
              label="Note"
              rules={[{ required: true, message: 'Veuillez donner une note' }]}
            >
              <Rate count={5} allowHalf />
            </Form.Item>
            <Form.Item
              name="contenu"
              label="Votre avis"
              rules={[{ required: true, message: 'Veuillez écrire un avis' }]}
            >
              <Input.TextArea rows={3} maxLength={500} showCount />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={submitting}>
                Publier l'avis
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )}

      {reviewsLoading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin />
        </div>
      ) : reviews && reviews.length > 0 ? (
        <List
          itemLayout="vertical"
          dataSource={reviews}
          renderItem={review => (
            <List.Item>
              <Card style={{ width: '100%', position: 'relative' }}>
                {/* Supprimer dans la box, en haut à droite */}
                {user && review.UserID === user.id && (
                  <Button
                    danger
                    size="small"
                    onClick={() => handleDeleteReview(review.AvisID)}
                    style={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}
                  >
                    Supprimer
                  </Button>
                )}
                <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 10 }}>
                  <Avatar icon={<UserOutlined />} style={{ marginRight: 15 }} />
                  <div>
                    <Text strong>{review.UserName || 'Anonyme'}</Text>
                    <div style={{ marginTop: 5 }}>
                      <Rate disabled count={5} allowHalf defaultValue={parseFloat(review.Note) || 0} />
                    </div>
                  </div>
                </div>
                <Paragraph style={{ marginTop: 10 }}>{review.Contenu}</Paragraph>
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Paragraph>Aucun avis pour ce jeu pour le moment.</Paragraph>
        </div>
      )}
    </div>
  );
}

export default GameDetails;