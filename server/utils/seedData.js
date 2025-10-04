const User = require('../models/User');
const Document = require('../models/Document');
const Form = require('../models/Form');
const { generateSampleData } = require('./dataGenerator');

const seedDatabase = async () => {
  try {
    console.log('🌱 开始初始化数据库...');
    
    // 检查是否已有数据
    const userCount = await User.countDocuments();
    const docCount = await Document.countDocuments();
    const formCount = await Form.countDocuments();
    
    if (userCount > 0 || docCount > 0 || formCount > 0) {
      console.log('📊 数据库已有数据，跳过初始化');
      return;
    }
    
    // 创建默认用户
    const defaultUser = new User({
      name: '管理员',
      email: 'admin@example.com',
      password: '123456',
      role: 'admin'
    });
    await defaultUser.save();
    console.log('✅ 创建默认用户');
    
    // 生成示例数据
    const sampleData = generateSampleData();
    const documents = Array.from(sampleData.values());
    
    // 创建文档
    const docPromises = documents.map(async (item) => {
      if (item.type === 'DOC') {
        const doc = new Document({
          title: item.title,
          content: item.content,
          type: item.type,
          isTrashed: item.isTrashed,
          lastUpdated: new Date(item.lastUpdated),
          author: defaultUser._id
        });
        return await doc.save();
      }
      return null;
    });
    
    const savedDocs = await Promise.all(docPromises);
    const validDocs = savedDocs.filter(doc => doc !== null);
    console.log(`✅ 创建 ${validDocs.length} 个文档`);
    
    // 创建表单
    const formPromises = documents.map(async (item) => {
      if (item.type === 'FORM') {
        const form = new Form({
          title: item.title,
          content: item.content,
          isTrashed: item.isTrashed,
          lastUpdated: new Date(item.lastUpdated),
          author: defaultUser._id
        });
        return await form.save();
      }
      return null;
    });
    
    const savedForms = await Promise.all(formPromises);
    const validForms = savedForms.filter(form => form !== null);
    console.log(`✅ 创建 ${validForms.length} 个表单`);
    
    console.log('🎉 数据库初始化完成！');
    console.log(`📊 总计: ${validDocs.length} 个文档, ${validForms.length} 个表单`);
    
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);
    throw error;
  }
};

module.exports = seedDatabase;

