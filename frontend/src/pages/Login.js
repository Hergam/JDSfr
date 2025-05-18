import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const { Title } = Typography;

function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await api.post('/login', {
        email: values.email,
        password: values.password
      });
      
      if (response.data.success) {
        message.success('Connexion réussie !');
        
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Notify other components (like Header) of login
        window.dispatchEvent(new Event('userChanged'));
        
        // Redirect to home page after successful login
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        message.error('Erreur de connexion: ' + (response.data.error || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      const errorMessage = error.response?.data?.error || 'Identifiants invalides. Veuillez réessayer.';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Card className="login-form" bordered={false}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 30 }}>Connexion</Title>
        
        <Form
          name="login_form"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Veuillez saisir votre email !' },
              { type: 'email', message: 'Veuillez entrer un email valide !' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Email"
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Veuillez saisir votre mot de passe !' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mot de passe"
              size="large"
            />
          </Form.Item>
          
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Se souvenir de moi</Checkbox>
            </Form.Item>

            <a style={{ float: 'right' }} href="#" onClick={() => message.info('Fonctionnalité à implémenter')}>
              Mot de passe oublié
            </a>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              className="login-form-button" 
              loading={loading} 
              size="large"
              block
            >
              Se connecter
            </Button>
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              Pas encore de compte ? <Link to="/register">S'inscrire maintenant</Link>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default Login;
