import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const { Title } = Typography;
const { Option } = Select;

function Register() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Préparer les données à envoyer au backend
      const userData = {
        username: values.username,
        password: values.password,
        email: values.email,
        statut: values.statut
      };
      
      // Appel à l'API backend en utilisant notre service API configuré
      const response = await api.post('/register', userData);
      
      if (response.data.success) {
        message.success('Inscription réussie !');
        // Rediriger vers la page de connexion après une inscription réussie
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        message.error('Erreur lors de l\'inscription: ' + (response.data.error || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      // Récupérer le message d'erreur du backend si disponible
      const errorMessage = error.response?.data?.error || 'Erreur lors de l\'inscription. Veuillez réessayer.';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <Card className="register-form" bordered={false}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 30 }}>Inscription</Title>
        
        <Form
          name="register_form"
          className="register-form"
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Veuillez saisir votre nom d\'utilisateur !' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Nom d'utilisateur"
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Veuillez saisir votre email !' },
              { type: 'email', message: 'Veuillez entrer un email valide !' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="Email"
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Veuillez saisir votre mot de passe !' },
              { min: 6, message: 'Le mot de passe doit contenir au moins 6 caractères !' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mot de passe"
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Veuillez confirmer votre mot de passe !' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Les deux mots de passe ne correspondent pas !'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirmer le mot de passe"
              size="large"
            />
          </Form.Item>
          
          {/* Champ caché pour statut */}
          <Form.Item name="statut" initialValue="Utilisateur" style={{ display: 'none' }}>
            <Input type="hidden" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button" loading={loading} size="large">
              S'inscrire
            </Button>
            Vous avez déjà un compte ? <Link to="/login">Connectez-vous !</Link>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default Register;
