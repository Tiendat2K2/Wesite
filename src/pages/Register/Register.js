import React from 'react';
import { Button, Input, Form, Typography, message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import axios from 'axios'; // Import axios for API calls
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/css/Login.css'; // Custom CSS for additional styling
import studentsImage from '../../assets/img/bia.png'; // Add your image of students
import logo from '../../assets/img/logo.png'; // Add the university logo image
import API_URL from '../../server/server';
const { Title } = Typography;

const Register = () => {
  const navigate = useNavigate(); // Initialize the useNavigate hook for redirection

  // Function to handle form submission
  const onFinish = async (values) => {
    const { email, username, password } = values;
    
    try {
      // Make the API request to the register endpoint
      const response = await axios.post(`${API_URL}/auth/register`, {
        Email: email,
        Username: username,
        Password: password,
      });

      // If registration is successful, show success message and redirect
      if (response.status === 200) {
        message.success('Đăng ký thành công!');
        setTimeout(() => {
          navigate('/'); // Redirect to the login page after registration
        }, 1000);
      }
    } catch (error) {
      // Show error message if registration fails
      if (error.response && error.response.data) {
        message.error(error.response.data.message || 'Đăng ký thất bại!');
      } else {
        message.error('Đăng ký thất bại, vui lòng thử lại sau!');
      }
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center login-container vh-100">
      <div className="row login-box shadow p-4 rounded">
        {/* Left Image Section */}
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <img
            src={studentsImage}
            alt="University students"
            className="img-fluid rounded"
          />
        </div>

        {/* Right Form Section */}
        <div className="col-md-6 login-form bg-light p-4 rounded">
          <div className="text-center mb-4">
            <img src={logo} alt="University logo" className="mb-3" style={{ maxWidth: '120px' }} />
            <Title level={3}>Đăng Ký</Title>
          </div>

          <Form
            name="register"
            layout="vertical"
            onFinish={onFinish}
          >
            {/* Email Field */}
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' },
                {
                  pattern: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                  message: 'Vui lòng nhập email có đuôi @gmail.com',
                },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Email"
                size="large"
              />
            </Form.Item>

            {/* Username Field */}
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Tên đăng nhập"
                size="large"
              />
            </Form.Item>

            {/* Password Field */}
            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
               
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                placeholder="Mật khẩu"
                size="large"
              />
            </Form.Item>

            {/* Confirm Password Field */}
            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu xác nhận không trùng khớp!'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                placeholder="Xác nhận mật khẩu"
                size="large"
              />
            </Form.Item>
            
            {/* Submit Button */}
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                className="btn-block btn-lg" 
                style={{ width: '100%', backgroundColor: '#d1a7a7', borderColor: '#d1a7a7' }}
              >
                Đăng ký
              </Button>
            </Form.Item>
          </Form>

          {/* Back to Login Button */}
          <div className="text-center">
            <Button 
              type="link" 
              onClick={() => navigate('/')} // Redirect to login page
              style={{ color: '#d1a7a7' }}
            >
              Quay về đăng nhập
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
