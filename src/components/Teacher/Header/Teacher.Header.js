import React, { useState, useEffect } from 'react';
import { Layout, Avatar, Menu, Dropdown, Modal, Form, Input, Button, message, Upload ,Select} from 'antd';
import { UserOutlined, LogoutOutlined, LockOutlined, UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import axiosInstance from '../../../server/authService';
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
  const [infoForm] = Form.useForm();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [fileList, setFileList] = useState([]);
  useEffect(() => {
    fetchUserInfo();
  }, []);
  const fetchUserInfo = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axiosInstance.get(`${API_URL}/auth/getUserById/${userId}`);
      setUserInfo(response.data.data[0]);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };
  const showChangePasswordModal = () => {
    setIsChangePasswordModalVisible(true);
  };
  const showUpdateInfoModal = () => {
    setIsUpdateInfoModalVisible(true);
    infoForm.setFieldsValue(userInfo);
  };
  const handleUpdatePassword = async () => {
    try {
      const values = await form.validateFields();
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('access_token');
      const response = await axiosInstance.put(
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
  
      const formData = new FormData();
      formData.append('UserID', userId);
      Object.keys(values).forEach(key => {
        if (key !== 'Img') {
          formData.append(key, values[key]);
        }
      });
      if (fileList.length > 0) {
        formData.append('Img', fileList[0].originFileObj);
      }
      const response = await axiosInstance.put(`${API_URL}/auth/updateUser`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        message.success('Cập nhật thông tin thành công');
        setIsUpdateInfoModalVisible(false);
        fetchUserInfo(); // Refresh user info
        // Dispatch a custom event to notify other components
        window.dispatchEvent(new Event('userInfoUpdated'));
        window.location.reload(); 
      } else {
        message.error('Failed to update information');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Validation failed or info update error!';
      message.error(errorMessage);
      console.error('Update info error:', error);
    }
  };
  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
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
      <Menu.Item key="1" icon={<UserOutlined />} onClick={showUpdateInfoModal}>
        Cập nhật thông tin
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
      label="Họ tên"
      name="Hoten"
      rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
    >
      <Input />
    </Form.Item>
    <Form.Item
      label="Ngày sinh"
      name="Ngaysinh"
      rules={[{ required: true, message: 'Vui lòng nhập ngày sinh!' }]}
    >
      <Input type="date" />
    </Form.Item>
    <Form.Item
      label="Nơi sinh"
      name="Noisinh"
      rules={[{ required: true, message: 'Vui lòng nhập nơi sinh!' }]}
    >
      <Input />
    </Form.Item>
    <Form.Item
      label="Chuyên ngành"
      name="Chuyenganh"
      rules={[{ required: true, message: 'Vui lòng nhập chuyên ngành!' }]}
    >
      <Input />
    </Form.Item>
    <Form.Item
      label="Số năm kinh nghiệm"
      name="Sonam"
      rules={[{ required: true, message: 'Vui lòng nhập số năm kinh nghiệm!' }]}
    >
      <Input type="number" />
    </Form.Item>
    <Form.Item
  label="Giới tính"
  name="Gioitinh"
  rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
>
  <Select placeholder="Chọn giới tính">
    <Select.Option value="Nam">Nam</Select.Option>
    <Select.Option value="Nữ">Nữ</Select.Option>
  </Select>
</Form.Item>
    <Form.Item
      label="Số điện thoại"
      name="Std"
      rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
    >
      <Input />
    </Form.Item>
    <Form.Item
      label="Tên đơn vị"
      name="Tendonvi"
      rules={[{ required: true, message: 'Vui lòng nhập tên đơn vị!' }]}
    >
      <Input />
    </Form.Item>
    <Form.Item
      label="Ngành"
      name="Nganh"
      rules={[{ required: true, message: 'Vui lòng nhập ngành!' }]}
    >
      <Input />
    </Form.Item>
    <Form.Item
      label="Mã giảng viên"
      name="MGV"
      rules={[{ required: true, message: 'Vui lòng nhập mã giảng viên!' }]}
    >
      <Input />
    </Form.Item>
    <Form.Item
      label="Ảnh đại diện"
      name="Img"
    >
      <Upload
        fileList={fileList}
        onChange={handleFileChange}
        beforeUpload={() => false}
      >
        <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
      </Upload>
    </Form.Item>
  </Form>
</Modal>
    </>
  );
};

export default CustomHeader;