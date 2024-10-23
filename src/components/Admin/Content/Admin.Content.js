import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spin, Alert } from 'antd';
import axiosInstance from '../../../server/authService';
import API_URL from '../../../server/server';

const Content = () => {
  const [data, setData] = useState({
    major: 0,
    articles: 0,
    teachers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dashboardContainerStyle = {
    padding: '24px',
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
  };

  const dashboardTitleStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '30px',
    textAlign: 'center',
    color: '#333',
  };

  const dashboardCardStyle = {
    border: '1px solid #eaeaea',
    borderRadius: '10px',
    padding: '16px',
    textAlign: 'center',
    transition: 'transform 0.2s, box-shadow 0.2s',
    backgroundColor: 'rgb(240, 220, 194)',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  };

  const cardTitleStyle = {
    fontSize: '20px',
    fontWeight: '700',
    marginBottom: '12px',
  };

  const cardValueStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#000',
  };

  const titleColors = {
    major: '#ff4d4f',
    articles: '#52c41a',
    teachers: '#1890ff',
  };

  const fetchData = async () => {
    try {
      // Fetch user counts
      const userCountResponse = await axiosInstance.get(`${API_URL}/auth/user-count`);

      // Fetch major count
      const majorCountResponse = await axiosInstance.get(`${API_URL}/chuyennganh/count`);

      // Fetch articles count
      // Note: You'll need to implement this endpoint on your backend
      const articlesCountResponse = await axiosInstance.get(`${API_URL}/dulieu/count`);

      setData({
        major: majorCountResponse.data.count || 0,
        articles: articlesCountResponse.data.count || 0, // Use actual count from the response
        teachers: userCountResponse.data.userCount || 0,
      });
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message); // Provide more descriptive error message
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <Spin size="large" style={{ display: 'block', margin: 'auto', marginTop: '50px' }} />;
  }

  if (error) {
    return <Alert message="Error fetching data" description={error} type="error" />;
  }

  return (
    <div style={dashboardContainerStyle}>
      <h2 style={dashboardTitleStyle}>Dashboard</h2>
      <Row gutter={16} style={{ marginTop: '16px' }}>
        <Col span={8}>
          <Card 
            style={dashboardCardStyle} 
            bodyStyle={{ padding: '10px' }} 
            hoverable
            headStyle={{ backgroundColor: '#e6f7ff' }} 
          >
            <div style={{ ...cardTitleStyle, color: titleColors.major }}>Tên chuyên ngành</div>
            <p style={cardValueStyle}>{data.major}</p>
          </Card>
        </Col>
        <Col span={8}>
          <Card 
            style={dashboardCardStyle} 
            bodyStyle={{ padding: '10px' }}
            hoverable
            headStyle={{ backgroundColor: '#e6f7ff' }}
          >
            <div style={{ ...cardTitleStyle, color: titleColors.articles }}>Số bài viết</div>
            <p style={cardValueStyle}>{data.articles}</p>
          </Card>
        </Col>
        <Col span={8}>
          <Card 
            style={dashboardCardStyle} 
            bodyStyle={{ padding: '10px' }}
            hoverable
            headStyle={{ backgroundColor: '#e6f7ff' }}
          >
            <div style={{ ...cardTitleStyle, color: titleColors.teachers }}>Tài khoản giáo viên</div>
            <p style={cardValueStyle}>{data.teachers}</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Content;
