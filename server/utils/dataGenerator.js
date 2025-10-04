const { faker } = require('@faker-js/faker');

// 设置faker的随机种子，确保每次启动都有不同的数据
faker.seed(Date.now());

function generateId(type = 'doc') {
  return `${type}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function nowIso() {
  return new Date().toISOString();
}

// 生成随机的文档内容
function generateDocumentContent(title) {
  const paragraphCount = faker.number.int({ min: 2, max: 5 });
  const content = `<h1>${title}</h1>${faker.lorem.paragraphs(paragraphCount, '<p>%s</p>')}`;
  return content;
}

// 生成随机的表单问题
function generateFormQuestions() {
  const questionTypes = [
    'questionInput',
    'questionRadio', 
    'questionCheckbox',
    'questionTextarea',
    'questionSelect'
  ];
  
  const questionCount = faker.number.int({ min: 2, max: 5 });
  const questions = [];
  
  for (let i = 0; i < questionCount; i++) {
    const type = faker.helpers.arrayElement(questionTypes);
    const question = generateQuestionByType(type);
    questions.push(question);
  }
  
  return questions;
}

function generateQuestionByType(type) {
  const baseQuestion = {
    id: faker.string.uuid(),
    type: type,
    title: faker.lorem.sentence({ min: 4, max: 8 }).replace('.', ''),
  };
  
  switch (type) {
    case 'questionInput':
      return {
        ...baseQuestion,
        props: { 
          placeholder: faker.lorem.words(3) + '...' 
        }
      };
      
    case 'questionRadio':
      return {
        ...baseQuestion,
        props: {
          options: faker.helpers.arrayElements([
            { text: '选项A', value: 'a' },
            { text: '选项B', value: 'b' },
            { text: '选项C', value: 'c' },
            { text: '选项D', value: 'd' }
          ], { min: 2, max: 4 })
        }
      };
      
    case 'questionCheckbox':
      return {
        ...baseQuestion,
        props: {
          options: faker.helpers.arrayElements([
            { text: '选项1', value: '1' },
            { text: '选项2', value: '2' },
            { text: '选项3', value: '3' },
            { text: '选项4', value: '4' },
            { text: '选项5', value: '5' }
          ], { min: 2, max: 5 })
        }
      };
      
    case 'questionTextarea':
      return {
        ...baseQuestion,
        props: { 
          placeholder: faker.lorem.sentence(),
          rows: faker.number.int({ min: 3, max: 6 })
        }
      };
      
    case 'questionSelect':
      return {
        ...baseQuestion,
        props: {
          options: faker.helpers.arrayElements([
            { text: '选项1', value: '1' },
            { text: '选项2', value: '2' },
            { text: '选项3', value: '3' }
          ], { min: 2, max: 4 })
        }
      };
      
    default:
      return baseQuestion;
  }
}

// 生成随机的文档
function generateDocument() {
  const id = generateId('doc');
  const title = faker.lorem.sentence({ min: 3, max: 8 }).replace('.', '');
  const content = generateDocumentContent(title);
  const lastUpdated = faker.date.past({ years: 0.5 }).toISOString();
  const isTrashed = faker.datatype.boolean({ probability: 0.3 }); // 增加trash概率
  
  return {
    id,
    title,
    content,
    lastUpdated,
    isTrashed,
    type: 'DOC'
  };
}

// 生成随机的表单
function generateForm() {
  const id = generateId('form');
  const title = faker.lorem.sentence({ min: 3, max: 6 }).replace('.', '') + ' 问卷';
  const formData = {
    title: title,
    description: faker.lorem.sentence(),
    questions: generateFormQuestions()
  };
  const lastUpdated = faker.date.past({ years: 0.5 }).toISOString();
  const isTrashed = faker.datatype.boolean({ probability: 0.25 }); // 增加trash概率
  
  return {
    id,
    title,
    content: JSON.stringify(formData),
    lastUpdated,
    isTrashed,
    type: 'FORM'
  };
}

// 生成示例数据
function generateSampleData() {
  const documents = new Map();
  
  // 生成随机数量的文档和表单
  const documentCount = faker.number.int({ min: 6, max: 12 });
  const formCount = faker.number.int({ min: 3, max: 8 });
  
  console.log(`Generating ${documentCount} documents and ${formCount} forms...`);
  
  // 生成文档
  for (let i = 0; i < documentCount; i++) {
    const doc = generateDocument();
    documents.set(doc.id, doc);
  }
  
  // 生成表单
  for (let i = 0; i < formCount; i++) {
    const form = generateForm();
    documents.set(form.id, form);
  }
  
  return documents;
}

module.exports = {
  generateId,
  nowIso,
  generateSampleData,
  generateDocument,
  generateForm
};
