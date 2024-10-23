import React, { useState } from 'react';
import { Button, Input, Form, Typography, message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/css/Login.css';
import studentsImage from '../../assets/img/bia.png';
import logo from '../../assets/img/logo.png';
import ForgotPasswordModal from '../../Modal/ForgotPassword/ForgotPassword'; // Import the new modal
import axios from 'axios';
import API_URL from '../../server/server'; // Import the API URL from the server config
import {jwtDecode} from 'jwt-decode'; // Import the jwt-decode library
const { Title } = Typography;
const Login = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const onFinish = async (values) => {
    const { username, password } = values;
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        Username: username,
        Password: password,
      });
      setLoading(false);
      if (response.data.status === 1) {
        const accessToken = response.data.access_token;
        const refreshToken = response.data.refresh_token;
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        const decodedToken = jwtDecode(accessToken);
        const userId = decodedToken.id;
        const roleId = decodedToken.roleId;
        localStorage.setItem('userId', userId);
        localStorage.setItem('roleId', roleId);
        
        // Navigate immediately based on roleId
        if (roleId === 1) {
          navigate('/admin');
          message.success('Đăng nhập thành công vào Admin!');
        } else if (roleId === 2) {
          navigate('/teacher');
          message.success('Đăng nhập thành công vào Teacher!');
        } else {
          message.error('Không thể xác định quyền truy cập!');
        }
      } else {
        message.error(response.data.message || 'Đăng nhập không thành công!');
      }
    } catch (error) {
      setLoading(false);
      if (error.response) {
        message.error(error.response.data.message || 'Có lỗi xảy ra khi đăng nhập!');
      } else {
        message.error('Không thể kết nối đến máy chủ!');
      }
      console.error('Login error:', error);
    }
  };
  const handleForgotPassword = () => {
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleSendEmail = () => {
    // Implement email sending logic
    setIsModalVisible(false); // Close modal after sending email
  };
  return (
    <div className="container-fluid d-flex justify-content-center align-items-center login-container vh-100">
      <div className="row login-box shadow p-4 rounded">
        {/* Left Image Section */}
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <img src={studentsImage} alt="University students" className="img-fluid rounded" />
        </div>
        {/* Right Form Section */}
        <div className="col-md-6 login-form bg-light p-4 rounded">
          <div className="text-center mb-4">
            <img src={logo} alt="University logo" className="mb-3" style={{ maxWidth: '120px' }} />
            <Title level={3}>Đăng Nhập</Title>
          </div>
          <Form name="login" layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Tên đăng nhập"
                size="large"
                style={{ color: '#000000' }} 
                aria-label="Tên đăng nhập"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                placeholder="Mật khẩu"
                size="large"
                aria-label="Mật khẩu"
              />
            </Form.Item>
            <Form.Item>
              <div className="d-flex justify-content-between">
                <Link to="/register">Đăng ký</Link>
                <Link onClick={handleForgotPassword} style={{ cursor: 'pointer' }}>Quên mật khẩu</Link>
              </div>
            </Form.Item>
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                className="btn-block btn-lg" 
                style={{ width: '100%', backgroundColor: '#d1a7a7', borderColor: '#d1a7a7' }}
                loading={loading} // Add loading indicator
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
          {/* Forgot Password Modal */}
          <ForgotPasswordModal
            visible={isModalVisible}
            onClose={handleCancel}
            onSendEmail={handleSendEmail}
          />
        </div>
      </div>
    </div>
  );
};
export default Login;