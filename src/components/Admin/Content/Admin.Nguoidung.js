import React, { useState, useEffect } from 'react';
import { Table, Input, message, Modal, Form, Button } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import axiosInstance from '../../../server/authService';
import API_URL from '../../../server/server';
const AdminNguoidung = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingItem, setEditingItem] = useState(null);
  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
    },
    {
      title: 'Email',
      dataIndex: 'Email',
      key: 'Email',
    },
    {
      title: 'Username',
      dataIndex: 'Username',
      key: 'Username',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'Std',
      key: 'Std',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button 
            icon={<EditOutlined />} 
            type="primary"
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button 
            icon={<DeleteOutlined />} 
            danger
            onClick={() => handleDelete(record.UserID)}
          >
            Xóa
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => handleResetPassword(record.UserID)}
          >
            Reset password
          </Button>
        </div>
      ),
    },
  ];

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/auth/getTeachers`);

      const formattedData = response.data.data.map((item, index) => ({
        key: item.UserID,
        stt: index + 1,
        Email: item.Email || 'N/A',
        Username: item.Username || 'N/A',
        Std: item.Std || 'N/A',
        UserID: item.UserID,
      }));

      setData(formattedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Failed to fetch data.');
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    setEditingItem(record);
    form.setFieldsValue({
      Email: record.Email,
      Username: record.Username,
      Std: record.Std,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (userId) => {
    try {
      await axiosInstance.delete(`${API_URL}/auth/deleteTeacher/${userId}`);
      message.success('Deleted successfully!');
      fetchData();
    } catch (error) {
      console.error('Error deleting data:', error);
      message.error('Failed to delete data.');
    }
  };

  const handleResetPassword = async (userId) => {
    try {
      await axiosInstance.post(`${API_URL}/auth/resetTeacherPassword/${userId}`);
      message.success(`Password reset successfully for User ID: ${userId}`);
    } catch (error) {
      console.error('Error resetting password:', error);
      message.error('Failed to reset password.');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      // Loại bỏ khoảng trắng thừa
      if (values.Email) values.Email = values.Email.trim();
      if (values.Username) values.Username = values.Username.trim();
      if (values.Std) values.Std = values.Std.trim();
  
      if (editingItem) {
        const response = await axiosInstance.put(`${API_URL}/auth/updateTeacher`, {
          ...values,
          UserID: editingItem.UserID,
        });
  
        if (response.data.status === 1) {
          message.success(response.data.message);
          setIsModalVisible(false);
          form.resetFields();
          fetchData();
        } else {
          message.error(response.data.message);
        }
      } else {
        // Xử lý thêm mới giáo viên (nếu cần)
      }
    } catch (error) {
      console.error('Lỗi khi lưu dữ liệu:', error);
      if (error.response && error.response.data) {
        message.error(error.response.data.message);
      } else {
        message.error('Lưu dữ liệu thất bại.');
      }
    }
  };
  const validateGmail = (_, value) => {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!value || gmailRegex.test(value)) {
        return Promise.resolve();
    }
    return Promise.reject('Vui lòng nhập đúng định dạng email Gmail!');
};
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Tài Khoản Người dùng</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
      <Input
        placeholder="Tìm kiếm theo tên..."
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={handleSearch}
        style={{ width: '300px', marginBottom: '20px' }}
      />
        
      </div>
      <Table
        columns={columns}
        dataSource={data.filter(item => 
          item.Username.toLowerCase().includes(searchText.toLowerCase()) || 
          item.Email.toLowerCase().includes(searchText.toLowerCase())
        )}
        pagination={false}
        bordered
        loading={loading}
        style={{ backgroundColor: '#F0F0F0' }}
      />
      <Modal
        title={editingItem ? "Sửa Thông Tin Giáo Viên" : "Thêm Giáo Viên Mới"}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical">
                <Form.Item
                    name="Email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Vui lòng nhập email!' },
                        { validator: validateGmail },
                        { whitespace: true, message: 'Email không được chứa khoảng trắng!' }
                    ]}
                >
                    <Input />
                </Form.Item>
          <Form.Item
            name="Username"
            label="Username"
            rules={[{ required: true, message: 'Vui lòng nhập username!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="Std"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
          >
            <Input />
          </Form.Item>
          {!editingItem && (
            <Form.Item
              name="Password"
              label="Password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default AdminNguoidung;