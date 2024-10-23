import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Modal, Form, message, Upload, Select } from 'antd';
import { UploadOutlined, EditOutlined, DeleteOutlined, EyeOutlined, DownloadOutlined, FileOutlined, FilePdfOutlined, FileWordOutlined, SearchOutlined ,PlusOutlined} from '@ant-design/icons';
import axiosInstance from '../../../server/authService';
import API_URL from '../../../server/server';

const { Option } = Select;

const TeacherBaiViet = () => {
  const [data, setData] = useState([]);
  const [chuyenNganhData, setChuyenNganhData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingRecord, setEditingRecord] = useState(null);
  const [deletingRecordId, setDeletingRecordId] = useState(null);
  const [filePreviewModal, setFilePreviewModal] = useState({ visible: false, fileUrl: '', fileName: '' });
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchData();
    fetchChuyenNganhData();
  }, []);
  const fetchData = async () => {
    try {
        const userId = localStorage.getItem('userId');
        const response = await axiosInstance.get(`${API_URL}/dulieu/getDulieuID/${userId}`);
        
        // Ghi lại dữ liệu phản hồi để kiểm tra cấu trúc
        console.log('Dữ liệu đã lấy:', response.data);

        // Đảm bảo rằng chúng ta kiểm tra trạng thái và lấy dữ liệu đúng cách
        if (response.data.status === 1) {
            setData(response.data.data); // Đặt dữ liệu trực tiếp vì nó đã là một mảng
        } else {
            console.error('Không thể lấy dữ liệu:', response.data.message);
            message.error(response.data.message);
        }
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
        message.error('Không thể lấy dữ liệu');
    }
};

  const fetchChuyenNganhData = async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/chuyennganh`);
      setChuyenNganhData(response.data);
    } catch (error) {
      console.error('Error fetching Chuyên ngành data:', error);
      message.error('Failed to fetch Chuyên ngành');
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
      Files: record.Files ? [{ uid: '-1', name: record.Files.split('/').pop(), status: 'done', url: `${API_URL}/${record.Files}` }] : [],
      ChuyenNganhID: record.ChuyenNganhID
    });
    setIsModalVisible(true);
  };

  const showDeleteConfirm = (id) => {
    setDeletingRecordId(id);
    setIsDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`${API_URL}/dulieu/deleteDulieu/${deletingRecordId}`);
      message.success('Xóa bản ghi thành công');
      setIsDeleteModalVisible(false);
      await fetchData();
    } catch (error) {
      console.error('Lỗi khi xóa bản ghi:', error);
      message.error('Không thể xóa bản ghi');
      setIsDeleteModalVisible(false);
    }
  };

  const handleModalOk = () => {
    form.validateFields()
      .then(async (values) => {
        try {
          const formData = new FormData();
          const userId = localStorage.getItem('userId');
          if (!userId) {
            message.error('User ID not found');
            return;
          }
  
          formData.append('UserID', userId);
  
          Object.keys(values).forEach((key) => {
            if (key === 'Files' && values[key] && values[key].length > 0) {
              formData.append('Files', values[key][0].originFileObj);
            } else if (key === 'ChuyenNganhID') {
              formData.append('ChuyenNganhID', values[key]);
            } else {
              formData.append(key, values[key]);
            }
          });
  
          if (editingRecord) {
            formData.append('ID', editingRecord.ID);
            await axiosInstance.put(`${API_URL}/dulieu/updateDulieu/${editingRecord.ID}`, formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
            });
            message.success('Cập nhật bản ghi thành công');
          } else {
            await axiosInstance.post(`${API_URL}/dulieu/addDulieu`, formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
            });
            message.success('Thêm bản ghi thành công');
          }
          setIsModalVisible(false);
          await fetchData();
        } catch (error) {
          console.error('Error saving record:', error);
          message.error('Failed to save record: ' + (error.response?.data?.message || 'Unknown error'));
        }
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleDeleteModalCancel = () => {
    setIsDeleteModalVisible(false);
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
const handleAdd = () => {
  setEditingRecord(null);
  setIsModalVisible(true);
}
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
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <span>
          <Button onClick={() => handleEdit(record)} icon={<EditOutlined />}>
            Sửa
          </Button>
          <Button onClick={() => showDeleteConfirm(record.ID)} icon={<DeleteOutlined />} style={{ marginLeft: '8px' }}>
            Xóa
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div>
      <h3 style={{marginLeft: '20px',marginTop: '20px'}}>Danh sách Bài Viết</h3>

      <div style={{ padding: '20px' }}>
       
         
        <Input
          placeholder="Tìm kiếm theo tên..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={handleSearch}
          style={{ width: '300px', marginBottom: '20px' }}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm Bài Viết
        </Button>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="ID"
          pagination={false}
          bordered
          style={{ backgroundColor: '#F0F0F0', marginTop: '20px' }}
        />
        <Modal
          title={editingRecord ? 'Chỉnh sửa Bài Viết' : 'Thêm Bài Viết'}
          visible={isModalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
        >
          <Form form={form} layout="vertical">
            <Form.Item name="Tieude" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
              <Input />
            </Form.Item>
            <Form.Item
              name="Files"
              label="File"
              valuePropName="fileList"
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) {
                  return e;
                }
                return e && e.fileList;
              }}
              rules={[{ required: editingRecord ? false : true, message: 'Vui lòng tải lên một file!' }]}
            >
              <Upload beforeUpload={() => false} maxCount={1}>
                <Button icon={<UploadOutlined />}>Tải lên</Button>
              </Upload>
            </Form.Item>
            <Form.Item name="Nhomtacgia" label="Nhóm tác giả" rules={[{ required: true, message: 'Vui lòng nhập nhóm tác giả!' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="Tapchixuatban" label="Tạp chí xuất bản" rules={[{ required: true, message: 'Vui lòng nhập tạp chí xuất bản!' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="Thongtinmatapchi" label="Thông tin mã tạp chí" rules={[{ required: true, message: 'Vui lòng nhập thông tin mã tạp chí!' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="Namhoc" label="Năm học" rules={[{ required: true, message: 'Vui lòng nhập năm học!' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="Ghichu" label="Ghi chú">
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              name="ChuyenNganhID"
              label="Chọn Chuyên ngành" 
              rules={[{ required: true, message: 'Vui lòng chọn chuyên ngành!' }]}
            >
              <Select placeholder="Chọn Chuyên ngành">
                {chuyenNganhData.map((item) => (
                  <Option key={item.IDChuyenNganh} value={item.IDChuyenNganh}>
                    {item.TenChuyenNganh}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Xác nhận xóa"
          visible={isDeleteModalVisible}
          onOk={handleDelete}
          onCancel={handleDeleteModalCancel}
        >
          <p>Bạn có chắc chắn muốn xóa bản ghi này không?</p>
        </Modal>

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