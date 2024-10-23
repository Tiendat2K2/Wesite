import React, { useEffect, useState } from 'react';
import { Layout, message } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import CustomHeader from '../../components/Teacher/Header/Teacher.Header';
import CustomFooter from '../../components/Teacher/Footer/Teacher.Footer';
import CustomSider from '../../components/Teacher/Sider/Teacher.Sider';
import TeacherContent from '../../components/Teacher/Content/Teacher.Content';
import TeacherBaiViet from '../../components/Teacher/Content/Teacher.BaiViet';
import axiosInstance from '../../server/authService';

const Teacher = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const isBaiVietPage = location.pathname === '/teacher/baiviet';

  useEffect(() => {
    const checkTokenValidity = async () => {
      try {
        await axiosInstance.get('/');
      } catch (error) {
        if (error.response && error.response.status === 401) {
          message.error('Your session has expired. Please log in again.');
          setIsAuthenticated(false);
          navigate('/login');
        }
      }
    };
    checkTokenValidity();
  }, [navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout style={{ height: '100vh' }}>
      <CustomHeader />
      <Layout>
        <CustomSider />
        <Layout.Content style={{ padding: '20px', backgroundColor: '#fff' }}>
          {isBaiVietPage ? <TeacherBaiViet /> : <TeacherContent />}
        </Layout.Content>
      </Layout>
      <CustomFooter />
    </Layout>
  );
};
export default Teacher;