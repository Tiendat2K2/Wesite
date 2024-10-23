import React, { useState } from 'react';
import { Layout, Avatar, Menu, Dropdown, Modal, Form, Input, Button, message } from 'antd';
import { UserOutlined, LogoutOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../../../assets/img/logo.png';
import API_URL from '../../../server/server';

const { Header } = Layout;

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 20px',
  backgroundColor: '#F0DCC2',
};

const CustomHeader = () => {
  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] = useState(false);
  const [isUpdateInfoModalVisible, setIsUpdateInfoModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [infoForm] = Form.useForm(); // Form for user info
  const navigate = useNavigate();

  const showChangePasswordModal = () => {
    setIsChangePasswordModalVisible(true);
  };

  const showUpdateInfoModal = () => {
    setIsUpdateInfoModalVisible(true);
  };

  const handleUpdatePassword = async () => {
    try {
      const values = await form.validateFields();
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('access_token');

      const response = await axios.put(
        `${API_URL}/auth/updatePassword`,
        {
          UserID: userId,
          oldPassword: values.currentPassword,
          newPassword: values.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        message.success('Cập nhật mật khẩu thành công');
        setIsChangePasswordModalVisible(false);
      } else {
        message.error('Failed to update password');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Validation failed or password update error!';
      message.error(errorMessage);
      console.error('Update password error:', error);
    }
  };

  const handleUpdateInfo = async () => {
    try {
      const values = await infoForm.validateFields();
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('access_token');

      const response = await axios.put(
        `${API_URL}/auth/updateInfo`,
        {
          UserID: userId,
          ...values,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        message.success('Cập nhật thông tin thành công');
        setIsUpdateInfoModalVisible(false);
      } else {
        message.error('Failed to update information');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Validation failed or info update error!';
      message.error(errorMessage);
      console.error('Update info error:', error);
    }
  };

  const handleCancel = () => {
    setIsChangePasswordModalVisible(false);
    setIsUpdateInfoModalVisible(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('userId');
    localStorage.removeItem('roleId');
    navigate('/');
    window.location.reload();
  };

  const menu = (
    <Menu>
      <Menu.Item key="" onClick={showUpdateInfoModal}>
      </Menu.Item>
      <Menu.Item key="2" icon={<LockOutlined />} onClick={showChangePasswordModal}>
        Đổi mật khẩu
      </Menu.Item>
      <Menu.Item key="3" icon={<LogoutOutlined />} onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Header style={headerStyle}>
        <img src={Logo} alt="Logo" style={{ height: '40px' }} />
        <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#87d068', cursor: 'pointer' }} />
        </Dropdown>
      </Header>

      {/* Change Password Modal */}
      <Modal
        title="Đổi mật khẩu"
        visible={isChangePasswordModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button key="update" type="primary" onClick={handleUpdatePassword}>
            Cập nhật
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Mật khẩu cũ"
            name="currentPassword"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Xác nhận mật khẩu mới"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu mới và xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>

      {/* Update Info Modal */}
      <Modal
        title="Cập nhật thông tin"
        visible={isUpdateInfoModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button key="update" type="primary" onClick={handleUpdateInfo}>
            Cập nhật
          </Button>,
        ]}
      >
        <Form form={infoForm} layout="vertical">
          <Form.Item
            label="Tên"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Vui lòng nhập email!' }, { type: 'email', message: 'Email không hợp lệ!' }]}
          >
            <Input />
          </Form.Item>
          {/* Add more fields as needed */}
        </Form>
      </Modal>
    </>
  );
};

export default CustomHeader;
