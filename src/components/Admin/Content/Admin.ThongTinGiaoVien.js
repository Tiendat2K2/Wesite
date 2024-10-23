import React, { useState, useEffect } from 'react';
import { Table, Input, message, Image } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import axiosInstance from '../../../server/authService';
import API_URL from '../../../server/server';
import '../../../assets/css/Login.css';
const AdminThongTinGiaoVien = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`${API_URL}/auth/getAllUsers`);

      if (response.data.status === 1 && Array.isArray(response.data.data)) {
        setData(response.data.data);
      } else {
        setData([]);
        message.error('Unexpected data format');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      message.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'Img',
      key: 'Img',
      render: (text) => {
        if (!text) return null;
        const imageUrl = `http://localhost:3000/uploads/${text.split('/').pop()}`;
        return (
          <Image
            src={imageUrl}
            alt="Teacher"
            style={{ width: 50, height: 50, objectFit: 'cover' }}
            fallback="data:image/png;base64,...fallback_image_base64_string..."
          />
        );
      },
    },
    {
      title: 'Họ Tên',
      dataIndex: 'Hoten',
      key: 'Hoten',
    },
    {
      title: 'Ngày Sinh',
      dataIndex: 'Ngaysinh',
      key: 'Ngaysinh',
      render: (text) => (text ? new Date(text).toLocaleDateString('vi-VN') : 'N/A'),
    },
    {
      title: 'Nơi Sinh',
      dataIndex: 'Noisinh',
      key: 'Noisinh',
    },
    {
      title: 'Chuyên Ngành',
      dataIndex: 'Chuyenganh',
      key: 'Chuyenganh',
    },
    {
      title: 'Số Năm',
      dataIndex: 'Sonam',
      key: 'Sonam',
    },
    {
      title: 'Giới Tính',
      dataIndex: 'Gioitinh',
      key: 'Gioitinh',
    },
    {
      title: 'Số Điện Thoại',
      dataIndex: 'Std',
      key: 'Std',
    },
    {
      title: 'Tên Đơn Vị',
      dataIndex: 'Tendonvi',
      key: 'Tendonvi',
    },
    {
      title: 'Ngành',
      dataIndex: 'Nganh',
      key: 'Nganh',
    },
  ];

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const filteredData = data.filter(item =>
    item.Hoten && item.Hoten.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ padding: '20px' }}>
      <h2>Thông tin giáo viên</h2>
      <Input
        placeholder="Tìm kiếm theo tên..."
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={handleSearch}
        style={{ width: '300px', marginBottom: '20px' }}
      />
      <Table
  columns={columns}
  dataSource={filteredData}
 rowKey="MGV"
  pagination={{
    pageSize: 5,
    
  }}
  bordered
  style={{ 
    backgroundColor: '#F0F0F0', 
    marginTop: '20px',
  }}
  className="custom-table"
/>
      
    </div>
  );
};
export default AdminThongTinGiaoVien;
