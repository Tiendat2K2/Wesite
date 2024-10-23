import React from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import axios from 'axios'; // Add Axios for API call
import API_URL from '../../server/server'; // Import API_URL for dynamic API calls

const ForgotPasswordModal = ({ visible, onClose, onSendEmail }) => {
  const handleSendEmail = (values) => {
    // Log values to debug
    console.log('Sending email:', values.Email); // Use values.Email as the key

    // Send the email to the server for password reset
    axios.post(`${API_URL}/auth/forgot-password`, {
      Email: values.Email, // Ensure the key matches the server-side expectation
    })
    .then((response) => {
      // Handle the response
      if (response.data.status === 1) {
        message.success({
          content: 'Đã gửi email khôi phục mật khẩu thành công!',
          style: { color: '#000' }, // Green color for success
        });
        onSendEmail(); // Call the onSendEmail callback if provided
      } else {
        message.success({
          content: response.data.message || 'Gửi email không thành công!',
          style: { color: '#000' }, // Red color for error
        });
      }
    })
    .catch((error) => {
      // Handle errors returned from the server
      if (error.response && error.response.data) {
        message.error({
          content: error.response.data.message || 'Gửi email không thành công!',
          style: { color: '#000' }, // Red color for error
        });
      } else {
        message.error({
          content: 'Có lỗi xảy ra khi gửi email!',
          style: { color: 'red' }, // Red color for general error
        });
      }
      console.error('Forgot password error:', error); // Log the error for debugging
    });
  };

  return (
    <Modal
      title="Quên Mật Khẩu"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form
        name="forgot-password"
        layout="vertical"
        onFinish={handleSendEmail}
      >
        <Form.Item
          name="Email" // Ensure this key matches what the server expects
          rules={[{ required: true, type: 'email', message: 'Vui lòng nhập địa chỉ email hợp lệ!' }]}
        >
          <Input placeholder="Nhập email của bạn" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Gửi
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ForgotPasswordModal;
