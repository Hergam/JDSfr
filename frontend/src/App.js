import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout, ConfigProvider } from 'antd';
import './styles/App.css';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import GameDetails from './pages/GameDetails';
import Admin from './pages/Admin';
import CreateGame from './pages/CreateGame';

const { Content } = Layout;

function App() {
  return (
    <ConfigProvider>
      <Router>
        <Layout className="layout" style={{ minHeight: '100vh' }}>
          <Header />
          <Content className="main-content">
            <div className="content-container">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/game/:id" element={<GameDetails />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/create-game" element={<CreateGame />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </Content>
          <Footer />
        </Layout>
      </Router>
    </ConfigProvider>
  );
}

export default App;
