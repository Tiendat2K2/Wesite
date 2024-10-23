import React, { useEffect, useState } from 'react';
import { Layout, Spin, message } from 'antd';
import axios from 'axios';
import API_URL from '../../../server/server';
import Logo from '../../../assets/img/logo.png';

const { Content } = Layout;

const contentStyle = {
  padding: '20px',
  backgroundColor: '#f7f9fc',
  borderRadius: '8px',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
};

const imageStyle = {
  width: '128px',
  height: '128px',
  borderRadius: '50%',
  objectFit: 'cover',
  marginBottom: '20px',
  border: '2px solid #ddd',
};

const infoContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '40px',
  marginBottom: '20px',
};

const textBlockWrapperStyle = {
  display: 'flex',
  flexDirection: 'row',
  gap: '20px',
  width: '100%',
};

const textBlockStyle = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  padding: '15px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  backgroundColor: '#fff',
  boxShadow: '0 1px 5px rgba(0, 0, 0, 0.1)',
};

const textStyle = {
  margin: '10px 0',
  fontSize: '16px',
  color: '#555',
};

const CustomContent = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const userId = localStorage.getItem('userId');
      const response = await axios.get(`${API_URL}/auth/getUserById/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: '*/*',
        },
      });

      if (response.data.status === 1 && response.data.data.length > 0) {
        const user = response.data.data[0];
        setUserData(user);
        // Set image URL from the backend
        setImageUrl(user.Img ? `http://localhost:3000/uploads/${user.Img.split('/').pop()}` : null); // Adjust the URL accordingly
      } else {
        throw new Error('Không có dữ liệu người dùng');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Error fetching user data. Please try again later.');
      message.error('Error fetching user data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spin tip="Loading..." />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Content style={contentStyle}>
      <div style={infoContainerStyle}>
        <img src={imageUrl || Logo} alt="Avatar" style={imageStyle} />
      </div>
      <div style={textBlockWrapperStyle}>
        <div style={textBlockStyle}>
          <p style={textStyle}><strong>Mã giáo viên:</strong> {userData?.MGV || 'N/A'}</p>
          <p style={textStyle}><strong>Họ tên:</strong> {userData?.Hoten || 'N/A'}</p>
          <p style={textStyle}><strong>Giới tính:</strong> {userData?.Gioitinh || 'N/A'}</p>
          <p style={textStyle}><strong>Ngày sinh:</strong> {userData?.Ngaysinh ? new Date(userData.Ngaysinh).toLocaleDateString() : 'N/A'}</p>
          <p style={textStyle}><strong>Nơi sinh:</strong> {userData?.Noisinh || 'N/A'}</p>
        </div>
        <div style={textBlockStyle}>
          <p style={textStyle}><strong>STĐ:</strong> {userData?.Std || 'N/A'}</p>
          <p style={textStyle}><strong>Số năm công tác:</strong> {userData?.Sonam || 'N/A'} năm</p>
          <p style={textStyle}><strong>Ngành:</strong> {userData?.Nganh || 'N/A'}</p>
          <p style={textStyle}><strong>Chuyên ngành:</strong> {userData?.Chuyenganh || 'N/A'}</p>
          <p style={textStyle}><strong>Tên đơn vị:</strong> {userData?.Tendonvi || 'N/A'}</p>
        </div>
      </div>
    </Content>
  );
};

export default CustomContent;
