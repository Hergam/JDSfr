import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Dropdown } from 'antd';
import { HomeOutlined, LoginOutlined, UserAddOutlined, LogoutOutlined, UserOutlined, SettingOutlined, PlusCircleOutlined } from '@ant-design/icons';

const { Header: AntHeader } = Layout;

function Header() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Listen for login/logout events
    const handleUserChanged = () => {
      const updatedUser = localStorage.getItem('user');
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };
    window.addEventListener('userChanged', handleUserChanged);

    return () => {
      window.removeEventListener('userChanged', handleUserChanged);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.dispatchEvent(new Event('userChanged'));
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profil'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Déconnexion'
    }
  ];

  // Add admin option if user has admin status
  if (user?.statut === 'Admin') {
    userMenuItems.unshift({
      key: 'admin',
      icon: <SettingOutlined />,
      label: <Link to="/admin">Administration</Link>
    });
  }

  const handleMenuClick = (e) => {
    if (e.key === 'logout') {
      handleLogout();
    } else if (e.key === 'profile') {
      navigate('/profile');
    }
  };

  return (
    <AntHeader className="header" style={{ background: '#001529' }}>
      <div className="logo">
        <Link to="/">JDSfr</Link>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <Button
            type="text"
            icon={<HomeOutlined />}
            style={{
              color: '#40a9ff',
              fontWeight: 'bold',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={() => navigate('/')}
          >
            Accueil
          </Button>
          {(user?.statut === 'Editeur' || user?.statut === 'Admin') && (
            <Button
              type="text"
              icon={<UserOutlined />}
              style={{
                color: '#40a9ff',
                fontWeight: 'bold',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={() => navigate('/mes-jeux')}
            >
              Mes Jeux
            </Button>
          )}
          {(user?.statut === 'Editeur' || user?.statut === 'Admin') && (
            <Button
              type="text"
              icon={<PlusCircleOutlined />}
              style={{
                color: '#fff',
                fontWeight: 'bold',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={() => navigate('/create-game')}
            >
              Créer un jeu
            </Button>
          )}
        </div>
        <div>
          {user ? (
            <Dropdown 
              menu={{ items: userMenuItems, onClick: handleMenuClick }} 
              placement="bottomRight"
            >
              <Button type="text" style={{ color: '#fff' }}>
                <UserOutlined /> {user.username}
              </Button>
            </Dropdown>
          ) : (
            <Menu
              theme="dark"
              mode="horizontal"
              style={{ 
                lineHeight: '64px',
                background: '#001529'
              }}
              items={[
                {
                  key: '2',
                  icon: <LoginOutlined />,
                  label: <Link to="/login" style={{ color: '#fff', fontWeight: 'bold' }}>Connexion</Link>,
                },
                {
                  key: '3',
                  icon: <UserAddOutlined />,
                  label: <Link to="/register" style={{ color: '#fff', fontWeight: 'bold' }}>Inscription</Link>,
                }
              ]}
            />
          )}
        </div>
      </div>
    </AntHeader>
  );
}

export default Header;
