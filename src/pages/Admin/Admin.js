import React, { useEffect, useState } from 'react';
import { Layout, message } from 'antd';
import { useLocation, Navigate } from 'react-router-dom';
import CustomHeader from '../../components/Admin/Header/Admin.Header';
import CustomFooter from '../../components/Admin/Footer/Admin.Footer';
import CustomSider from '../../components/Admin/Sider/Admin.Sider';
import AdminContent from '../../components/Admin/Content/Admin.Content';
import AdminBaiViet from '../../components/Admin/Content/Admin.BaiViet';
import AdminTenChuyenNganh from '../../components/Admin/Content/Admin.TenChuyenNganh';
import AdminNguoiDung from '../../components/Admin/Content/Admin.Nguoidung';
import AdminThongTinGiaoVien from '../../components/Admin/Content/Admin.ThongTinGiaoVien';
import axiosInstance, { refreshToken } from '../../server/authService';

const Admin = () => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    const checkTokenValidity = async () => {
      try {
        await axiosInstance.get('/some-protected-route');
      } catch (error) {
        if (error.response && error.response.status === 401) {
          try {
            await refreshToken();
            message.success('Session refreshed successfully');
          } catch (refreshError) {
            message.error('Your session has expired. Please log in again.');
            setIsAuthenticated(false);
          }
        }
      }
    };
    checkTokenValidity();
  }, []);

  const currentPage = location.pathname;

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <Layout style={{ height: '100vh' }}>
      <CustomHeader />
      <Layout>
        <CustomSider />
        <Layout.Content style={{ padding: '20px', backgroundColor: '#fff' }}>
          {currentPage === '/admin/baiviet' && <AdminBaiViet />}
          {currentPage === '/admin/tenchuyennganh' && <AdminTenChuyenNganh />}
          {currentPage === '/admin/nguoidung' && <AdminNguoiDung />}
          {currentPage === '/admin/thongtingiaovien' && <AdminThongTinGiaoVien />}
          {currentPage === '/admin/taikhoan' && <AdminThongTinGiaoVien />}
          {currentPage !== '/admin/baiviet' &&
            currentPage !== '/admin/tenchuyennganh' &&
            currentPage !== '/admin/nguoidung' &&
            currentPage !== '/admin/thongtingiaovien' &&
            currentPage !== '/admin/taikhoan' && <AdminContent />}
        </Layout.Content>
      </Layout>
      <CustomFooter />
    </Layout>
  );
};

export default Admin;