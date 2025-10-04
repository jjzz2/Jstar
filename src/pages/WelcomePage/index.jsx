import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Space, Card, Row, Col, Statistic } from 'antd';
import { 
  FileTextOutlined, 
  FormOutlined, 
  RobotOutlined, 
  TeamOutlined,
  RocketOutlined,
  StarOutlined
} from '@ant-design/icons';
import styles from './styles.module.css';

const { Title, Paragraph } = Typography;

const WelcomePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    documents: 0,
    forms: 0,
    users: 0
  });

  useEffect(() => {
    // 模拟加载数据
    const timer = setTimeout(() => {
      setStats({
        documents: 15,
        forms: 8,
        users: 3
      });
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: <FileTextOutlined className={styles.featureIcon} />,
      title: '智能文档编辑',
      description: '强大的富文本编辑器，支持实时协作和AI智能助手'
    },
    {
      icon: <FormOutlined className={styles.featureIcon} />,
      title: '动态表单构建',
      description: '可视化表单设计器，轻松创建复杂的表单应用'
    },
    {
      icon: <RobotOutlined className={styles.featureIcon} />,
      title: 'AI智能助手',
      description: '基于DeepSeek的AI助手，提供文档总结、翻译、优化建议'
    },
    {
      icon: <TeamOutlined className={styles.featureIcon} />,
      title: '团队协作',
      description: '实时协作编辑，权限管理，版本控制'
    }
  ];

  return (
    <div className={styles.welcomeContainer}>
      {/* 背景动画 */}
      <div className={styles.backgroundAnimation}>
        <div className={styles.floatingShape}></div>
        <div className={styles.floatingShape}></div>
        <div className={styles.floatingShape}></div>
      </div>

      {/* 主要内容 */}
      <div className={styles.content}>
        <div className={styles.heroSection}>
          <div className={styles.heroContent}>
            <Title level={1} className={styles.heroTitle}>
              <RocketOutlined className={styles.rocketIcon} />
              腾讯文档克隆
            </Title>
            <Paragraph className={styles.heroSubtitle}>
              现代化的文档协作平台，集成AI智能助手，让文档创作更高效
            </Paragraph>
            
            <Space size="large" className={styles.heroActions}>
              <Button 
                type="primary" 
                size="large" 
                icon={<FileTextOutlined />}
                onClick={() => navigate('/dashboard')}
                className={styles.primaryButton}
              >
                开始使用
              </Button>
              <Button 
                size="large" 
                icon={<StarOutlined />}
                className={styles.secondaryButton}
              >
                了解更多
              </Button>
            </Space>
          </div>
        </div>

        {/* 统计数据 */}
        <div className={styles.statsSection}>
          <Row gutter={[32, 32]} justify="center">
            <Col xs={24} sm={8}>
              <Card className={styles.statCard}>
                <Statistic
                  title="文档数量"
                  value={stats.documents}
                  prefix={<FileTextOutlined />}
                  loading={loading}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className={styles.statCard}>
                <Statistic
                  title="表单数量"
                  value={stats.forms}
                  prefix={<FormOutlined />}
                  loading={loading}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className={styles.statCard}>
                <Statistic
                  title="活跃用户"
                  value={stats.users}
                  prefix={<TeamOutlined />}
                  loading={loading}
                />
              </Card>
            </Col>
          </Row>
        </div>

        {/* 功能特性 */}
        <div className={styles.featuresSection}>
          <Title level={2} className={styles.sectionTitle}>
            核心功能
          </Title>
          <Row gutter={[32, 32]}>
            {features.map((feature, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card 
                  className={styles.featureCard}
                  hoverable
                >
                  <div className={styles.featureContent}>
                    {feature.icon}
                    <Title level={4} className={styles.featureTitle}>
                      {feature.title}
                    </Title>
                    <Paragraph className={styles.featureDescription}>
                      {feature.description}
                    </Paragraph>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* 技术栈 */}
        <div className={styles.techStackSection}>
          <Title level={2} className={styles.sectionTitle}>
            技术栈
          </Title>
          <div className={styles.techStack}>
            <div className={styles.techItem}>React 18</div>
            <div className={styles.techItem}>Vite</div>
            <div className={styles.techItem}>Ant Design</div>
            <div className={styles.techItem}>Koa.js</div>
            <div className={styles.techItem}>MongoDB</div>
            <div className={styles.techItem}>DeepSeek AI</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
