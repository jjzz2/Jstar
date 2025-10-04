import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

class FileService {
  /**
   * 读取本地文件并创建文档记录
   * @param {File} file - 本地文件
   * @returns {Promise<Object>} 包含文档ID的响应
   */
  async openLocalFile(file) {
    try {
      // 读取文件内容
      const content = await this.readFileContent(file);
      
      // 创建文档记录
      const documentData = {
        title: file.name.replace(/\.[^/.]+$/, ''), // 移除扩展名
        content: content,
        type: 'FILE',
        originalFileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        isLocalFile: true
      };

      const response = await axios.post(`${API_BASE_URL}/api/docs`, documentData);
      return response.data;
    } catch (error) {
      console.error('打开本地文件失败:', error);
      throw new Error(error.response?.data?.message || '打开本地文件失败');
    }
  }

  /**
   * 读取文件内容
   * @param {File} file - 文件对象
   * @returns {Promise<string>} 文件内容
   */
  readFileContent(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      
      reader.onerror = (e) => {
        reject(new Error('文件读取失败'));
      };
      
      // 根据文件类型选择读取方式
      if (file.type.startsWith('text/') || file.name.endsWith('.md') || file.name.endsWith('.txt')) {
        reader.readAsText(file, 'UTF-8');
      } else {
        // 对于其他类型文件，尝试作为文本读取
        reader.readAsText(file, 'UTF-8');
      }
    });
  }

  /**
   * 获取本地文件文档列表
   * @returns {Promise<Array>} 本地文件文档列表
   */
  async getLocalFileDocuments() {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/docs?type=FILE`);
      return response.data;
    } catch (error) {
      console.error('获取本地文件文档失败:', error);
      throw new Error(error.response?.data?.message || '获取本地文件文档失败');
    }
  }
}

export const fileService = new FileService();
export const openLocalFile = fileService.openLocalFile.bind(fileService);
export default fileService;
