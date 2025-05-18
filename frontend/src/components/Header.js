import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Dropdown } from 'antd';
import { HomeOutlined, LoginOutlined, UserAddOutlined, LogoutOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons';

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

  // Add create game option if user is Editeur
  if (user?.statut === 'Editeur') {
    userMenuItems.unshift({
      key: 'create-game',
      icon: <HomeOutlined />,
      label: <Link to="/create-game">Créer un jeu</Link>
    });
  }

  const handleMenuClick = (e) => {
    if (e.key === 'logout') {
      handleLogout();
    } else if (e.key === 'profile') {
      // Navigate to profile page
      // navigate('/profile');
    }
  };

  return (
    <AntHeader className="header" style={{ background: '#001529' }}>
      <div className="logo">
        <Link to="/">JDSfr</Link>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          style={{ 
            lineHeight: '64px',
            background: '#001529'
          }}
          items={[
            {
              key: '1',
              icon: <HomeOutlined />,
              label: <Link to="/" style={{ color: '#fff', fontWeight: 'bold' }}>Accueil</Link>,
            }
          ]}
        />

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
