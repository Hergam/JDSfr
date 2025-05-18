import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Modal, Select, Typography, message, Spin } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const { Title } = Typography;
const { Option } = Select;

function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    // Fallback: check both 'statut' and 'Statut'
    const userStatut = user?.statut || user?.Statut;

    // Check if user is logged in and is admin
    if (!user) {
      message.error("Veuillez vous connecter");
      navigate('/login');
      return;
    }

    if (userStatut !== 'Admin') {
      message.error("Accès non autorisé");
      navigate('/');
      return;
    }

    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      
      const response = await api.get('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${user.id}`
        }
      });
      
      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        message.error("Erreur lors du chargement des utilisateurs");
      }
    } catch (error) {
      console.error("Erreur:", error);
      message.error("Impossible de charger les utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  const showEditModal = (user) => {
    setSelectedUser(user);
    setSelectedStatus(user.Statut);
    setEditModalVisible(true);
  };

  const showDeleteModal = (user) => {
    setSelectedUser(user);
    setDeleteModalVisible(true);
  };

  const handleUpdateStatus = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      
      const response = await api.put(`/api/admin/users/${selectedUser.UserID}`, 
        { statut: selectedStatus },
        { headers: { 'Authorization': `Bearer ${user.id}` } }
      );
      
      if (response.data.success) {
        message.success("Statut de l'utilisateur mis à jour avec succès");
        fetchUsers();
      } else {
        message.error("Erreur lors de la mise à jour du statut");
      }
    } catch (error) {
      console.error("Erreur:", error);
      message.error("Impossible de mettre à jour le statut");
    } finally {
      setEditModalVisible(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      
      const response = await api.delete(`/api/admin/users/${selectedUser.UserID}`, {
        headers: { 'Authorization': `Bearer ${user.id}` }
      });
      
      if (response.data.success) {
        message.success("Utilisateur supprimé avec succès");
        fetchUsers();
      } else {
        message.error("Erreur lors de la suppression de l'utilisateur");
      }
    } catch (error) {
      console.error("Erreur:", error);
      message.error("Impossible de supprimer l'utilisateur");
    } finally {
      setDeleteModalVisible(false);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'UserID',
      key: 'UserID',
    },
    {
      title: 'Nom',
      dataIndex: 'Nom',
      key: 'Nom',
    },
    {
      title: 'Email',
      dataIndex: 'Email',
      key: 'Email',
    },
    {
      title: 'Statut',
      dataIndex: 'Statut',
      key: 'Statut',
      render: (statut) => {
        let color = 'blue';
        if (statut === 'Admin') {
          color = 'red';
        } else if (statut === 'Editeur') {
          color = 'green';
        }
        return <Tag color={color}>{statut}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
          >
            Éditer
          </Button>
          <Button 
            type="primary" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => showDeleteModal(record)}
          >
            Supprimer
          </Button>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="admin-page">
      <Title level={2}>Gestion des Utilisateurs</Title>
      
      <Table 
        dataSource={users} 
        columns={columns} 
        rowKey="UserID"
        pagination={{ pageSize: 10 }}
      />

      {/* Edit User Modal */}
      <Modal
        title={`Modifier le statut de ${selectedUser?.Nom}`}
        open={editModalVisible}
        onOk={handleUpdateStatus}
        onCancel={() => setEditModalVisible(false)}
        okText="Confirmer"
        cancelText="Annuler"
      >
        <p>Changer le statut de l'utilisateur:</p>
        <Select
          value={selectedStatus}
          onChange={(value) => setSelectedStatus(value)}
          style={{ width: '100%' }}
        >
          <Option value="Utilisateur">Utilisateur</Option>
          <Option value="Editeur">Éditeur</Option>
          <Option value="Admin">Admin</Option>
        </Select>
      </Modal>

      {/* Delete User Modal */}
      <Modal
        title="Confirmer la suppression"
        open={deleteModalVisible}
        onOk={handleDeleteUser}
        onCancel={() => setDeleteModalVisible(false)}
        okText="Supprimer"
        cancelText="Annuler"
        okButtonProps={{ danger: true }}
      >
        <p>Êtes-vous sûr de vouloir supprimer l'utilisateur {selectedUser?.Nom} ?</p>
        <p>Cette action est irréversible.</p>
      </Modal>
    </div>
  );
}

export default Admin;