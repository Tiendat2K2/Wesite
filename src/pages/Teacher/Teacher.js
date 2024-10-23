import React, { useEffect, useState } from 'react';
import { Layout, message } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import CustomHeader from '../../components/Teacher/Header/Teacher.Header';
import CustomFooter from '../../components/Teacher/Footer/Teacher.Footer';
import CustomSider from '../../components/Teacher/Sider/Teacher.Sider';
import TeacherContent from '../../components/Teacher/Content/Teacher.Content';
import TeacherBaiViet from '../../components/Teacher/Content/Teacher.BaiViet';
import TeacherDanhSachBaiViet from '../../components/Teacher/Content/Teacher,DanhSachBaiViet'; // Correct import path
import axiosInstance from '../../server/authService';

const Teacher = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Determine which page is currently active
  const isBaiVietPage = location.pathname === '/teacher/baiviet';
  const isDanhSachBaiVietPage = location.pathname === '/teacher/danhsachbaiviet'; // Check for DanhSachBaiViet page

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
          {/* Conditional rendering based on the current path */}
          {isBaiVietPage ? (
            <TeacherBaiViet />
          ) : isDanhSachBaiVietPage ? (
            <TeacherDanhSachBaiViet />
          ) : (
            <TeacherContent />
          )}
        </Layout.Content>
      </Layout>
      <CustomFooter />
    </Layout>
  );
};

export default Teacher;
