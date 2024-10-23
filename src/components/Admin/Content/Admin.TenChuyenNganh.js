import React, { useState, useEffect } from 'react';
import { Table, Input, message, Modal, Form, Button } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axiosInstance from '../../../server/authService';
import API_URL from '../../../server/server';

const AdminTenChuyenNganh = () => {
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
      title: 'Tên Chuyên Ngành',
      dataIndex: 'TenChuyenNganh',
      key: 'TenChuyenNganh',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            type="primary"
            ghost
          >
            Sửa
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.key)}
            danger
            ghost
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/chuyennganh`);
      const formattedData = response.data.map((item, index) => ({
        key: item.IDChuyenNganh,
        stt: index + 1,
        TenChuyenNganh: item.TenChuyenNganh || 'N/A',
      }));
      setData(formattedData);
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredData = data.filter((item) =>
    item.TenChuyenNganh.toLowerCase().includes(searchText.toLowerCase())
  );

  const showModal = (item = null) => {
    setEditingItem(item);
    if (item) {
      form.setFieldsValue({ TenChuyenNganh: item.TenChuyenNganh });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleEdit = (item) => {
    showModal(item);
  };

  const handleModalOk = () => {
    form.validateFields()
      .then(async (values) => {
        try {
          // Retrieve the access token from localStorage
          const token = localStorage.getItem('access_token');
          const userId = localStorage.getItem('userId');
  
          // Check if the token exists
          if (!token) {
            message.error('Token không hợp lệ. Vui lòng đăng nhập lại.');
            return;
          }
  
          // Decode the token to get the userId
      
          
          // Prepare the payload with form data
          const payload = {
            TenChuyenNganh: values.TenChuyenNganh,
            UserID: userId, // UserID from token
          };
  
          let response;
          if (editingItem) {
            // Include ID for updating existing ChuyenNganh
            payload.IDChuyenNganh = editingItem.key;
            response = await axiosInstance.put(`${API_URL}/chuyennganh/updateChuyenNganh`, payload);
          } else {
            // Add new ChuyenNganh
            response = await axiosInstance.post(`${API_URL}/chuyennganh/addChuyenNganh`, payload);
          }
  
          // Check the response and handle success or error
          if (response.data.status === 1) {
            setIsModalVisible(false);
            fetchData();
            message.success(response.data.message);
          } else {
            message.error(response.data.message);
          }
        } catch (error) {
          console.error('Error saving data:', error);
          // Handle error response from API
          if (error.response && error.response.data && error.response.data.message) {
            message.error(error.response.data.message);
          } else {
            message.error('Thao tác thất bại');
          }
        }
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa chuyên ngành này?',
      okText: 'Có',
      okType: 'danger',
      cancelText: 'Không',
      onOk: async () => {
        try {
          await axiosInstance.delete(`${API_URL}/chuyennganh/deleteChuyenNganh/${id}`);
          message.success('Xóa chuyên ngành thành công');
          fetchData();
        } catch (error) {
          console.error('Error deleting data:', error);
          message.error('Xóa thất bại');
        }
      },
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Quản lý Chuyên Ngành</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
      <Input
        placeholder="Tìm kiếm theo tên..."
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={handleSearch}
        style={{ width: '300px', marginBottom: '20px' }}
      />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          Thêm Chuyên Ngành
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={false}
        bordered
        loading={loading}
        style={{ backgroundColor: '#F0F0F0' }}
      />

      <Modal
        title={editingItem ? "Cập nhật Chuyên Ngành" : "Thêm Chuyên Ngành"}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="TenChuyenNganh"
            label="Tên Chuyên Ngành"
            rules={[{ required: true, message: 'Vui lòng nhập tên chuyên ngành' }]}
          >
            <Input placeholder="Nhập tên chuyên ngành" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminTenChuyenNganh;