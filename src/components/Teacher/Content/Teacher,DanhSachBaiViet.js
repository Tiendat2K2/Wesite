import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Modal, message } from 'antd';
import { EyeOutlined, DownloadOutlined, FileOutlined, FilePdfOutlined, FileWordOutlined, SearchOutlined } from '@ant-design/icons';
import axiosInstance from '../../../server/authService';
import API_URL from '../../../server/server';
import '../../../assets/css/Login.css';

const TeacherBaiViet = () => {
  const [data, setData] = useState([]);
  const [filePreviewModal, setFilePreviewModal] = useState({ visible: false, fileUrl: '', fileName: '' });
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/dulieu`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Failed to fetch data');
    }
  };

  const handleDownload = async (id, fileName) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/dulieu/download/${id}`, {
        responseType: 'blob',
      });
      
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading file:', error);
      message.error('Failed to download file');
    }
  };

  const handleView = async (id) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/dulieu/view/${id}`, {
        responseType: 'blob',
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const fileUrl = window.URL.createObjectURL(blob);
      setFilePreviewModal({ visible: true, fileUrl, fileName: 'Document Preview' });
    } catch (error) {
      console.error('Error viewing file:', error);
      message.error('Failed to view file');
    }
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FilePdfOutlined style={{ color: 'red' }} />;
      case 'doc':
      case 'docx':
        return <FileWordOutlined style={{ color: 'blue' }} />;
      default:
        return <FileOutlined />;
    }
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredData = data.filter(item =>
    item.Tieude.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'Tieude',
      key: 'tieuDe',
    },
    {
      title: 'File',
      dataIndex: 'Files',
      key: 'files',
      render: (files, record) =>
        files ? (
          <span>
            {getFileIcon(files)}
            <Button type="link" onClick={() => handleView(record.ID)}>
              <EyeOutlined /> Xem
            </Button>
            <Button 
              type="link" 
              onClick={() => handleDownload(record.ID, files.split('/').pop())}
            >
              <DownloadOutlined /> Tải xuống
            </Button>
          </span>
        ) : (
          'N/A'
        ),
    },
    {
      title: 'Nhóm tác giả',
      dataIndex: 'Nhomtacgia',
      key: 'nhomTacGia',
    },
    {
      title: 'Tạp chí xuất bản',
      dataIndex: 'Tapchixuatban',
      key: 'tapChiXuatBan',
    },
    {
      title: 'Thông tin mã tạp chí',
      dataIndex: 'Thongtinmatapchi',
      key: 'thongTinMaTapChi',
    },
    {
      title: 'Năm học',
      dataIndex: 'Namhoc',
      key: 'namHoc',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'Ghichu',
      key: 'ghiChu',
    },
  ];

  return (
    <div>
      <h3 style={{marginLeft: '20px', marginTop: '20px'}}>Danh sách Bài Viết</h3>
      <div style={{ padding: '20px' }}>
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
          rowKey="ID"
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
        <Modal
          title="Chi tiết File"
          visible={filePreviewModal.visible}
          onCancel={() => setFilePreviewModal({ ...filePreviewModal, visible: false })}
          footer={[
            <Button key="back" onClick={() => setFilePreviewModal({ ...filePreviewModal, visible: false })}>
              Đóng
            </Button>,
          ]}
          width={800}
        >
          <iframe
            src={filePreviewModal.fileUrl}
            width="100%"
            height="500px"
            title="File Preview"
          />
        </Modal>
      </div>
    </div>
  );
};

export default TeacherBaiViet;
