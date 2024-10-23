import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Sider } = Layout;

const siderStyle = {
  backgroundColor: '#F0DCC2',
};

const CustomSider = () => {
  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState('1'); // State to keep track of selected menu item

  const handleMenuClick = (e) => {
    setSelectedKey(e.key); // Update the selected menu item

    if (e.key === '1') {
      navigate('/teacher'); // Navigate to Dashboard
    } else if (e.key === '2') {
      navigate('/teacher/baiviet'); // Navigate to BaiViet page
    }
  };

  return (
    <Sider width="200" style={siderStyle}>
      <Menu
        mode="vertical"
        selectedKeys={[selectedKey]} // Set the selected key based on state
        onClick={handleMenuClick}
        items={[
          {
            key: '1',
            label: 'Dashboard',
            style: selectedKey === '2' ? { backgroundColor: '#F0DCC2' } : {}, // Change color of Bài viết giáo viên if Dashboard is clicked
          },
          {
            key: '2',
            label: 'Bài viết giáo viên',
            style: selectedKey === '1' ? { backgroundColor: '#F0DCC2' } : {}, // Highlight this item when selected
          },
        ]}
      />
    </Sider>
  );
};

export default CustomSider;
