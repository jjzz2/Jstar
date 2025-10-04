import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { formsService } from '../services/formsService';

// Component types based on legacy analysis
export const COMPONENT_TYPES = {
  QUESTION_INPUT: 'questionInput',
  QUESTION_TITLE: 'questionTitle',
  QUESTION_PARAGRAPH: 'questionParagraph',
  QUESTION_INFO: 'questionInfo',
  QUESTION_TEXTAREA: 'questionTextarea',
  QUESTION_RADIO: 'questionRadio',
  QUESTION_CHECKBOX: 'questionCheckbox',
};

// Component configuration based on legacy structure
export const COMPONENT_CONFIGS = {
  [COMPONENT_TYPES.QUESTION_INPUT]: {
    title: '单行输入',
    type: COMPONENT_TYPES.QUESTION_INPUT,
    defaultProps: {
      title: '请输入标题',
      placeholder: '请输入内容',
    },
  },
  [COMPONENT_TYPES.QUESTION_TITLE]: {
    title: '标题',
    type: COMPONENT_TYPES.QUESTION_TITLE,
    defaultProps: {
      text: '标题',
      level: 1,
      isCenter: false,
    },
  },
  [COMPONENT_TYPES.QUESTION_PARAGRAPH]: {
    title: '段落',
    type: COMPONENT_TYPES.QUESTION_PARAGRAPH,
    defaultProps: {
      text: '段落内容',
      isCenter: false,
    },
  },
  [COMPONENT_TYPES.QUESTION_INFO]: {
    title: '信息',
    type: COMPONENT_TYPES.QUESTION_INFO,
    defaultProps: {
      title: '信息标题',
      desc: '信息描述',
    },
  },
  [COMPONENT_TYPES.QUESTION_TEXTAREA]: {
    title: '多行输入',
    type: COMPONENT_TYPES.QUESTION_TEXTAREA,
    defaultProps: {
      title: '请输入标题',
      placeholder: '请输入内容',
    },
  },
  [COMPONENT_TYPES.QUESTION_RADIO]: {
    title: '单选',
    type: COMPONENT_TYPES.QUESTION_RADIO,
    defaultProps: {
      title: '单选标题',
      options: [
        { text: '选项1', value: 'option1' },
        { text: '选项2', value: 'option2' },
      ],
      value: '',
    },
  },
  [COMPONENT_TYPES.QUESTION_CHECKBOX]: {
    title: '多选',
    type: COMPONENT_TYPES.QUESTION_CHECKBOX,
    defaultProps: {
      title: '多选标题',
      list: [
        { text: '选项1', value: 'option1', checked: false },
        { text: '选项2', value: 'option2', checked: false },
      ],
    },
  },
};

// Component groups for toolbox
export const COMPONENT_GROUPS = [
  {
    groupId: 'textGroup',
    groupName: '文本显示',
    components: [
      COMPONENT_TYPES.QUESTION_INFO,
      COMPONENT_TYPES.QUESTION_TITLE,
      COMPONENT_TYPES.QUESTION_PARAGRAPH,
    ],
  },
  {
    groupId: 'inputGroup',
    groupName: '用户输入',
    components: [
      COMPONENT_TYPES.QUESTION_INPUT,
      COMPONENT_TYPES.QUESTION_TEXTAREA,
    ],
  },
  {
    groupId: 'chooseGroup',
    groupName: '用户选择',
    components: [
      COMPONENT_TYPES.QUESTION_RADIO,
      COMPONENT_TYPES.QUESTION_CHECKBOX,
    ],
  },
];

// Generate unique component ID
function generateComponentId() {
  return `comp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

// Initial state
const initialState = {
  selectedId: '',
  componentList: [],
  copiedComponent: null,
  pageInfo: {
    title: '未命名表单',
    desc: '',
  },
  loading: false,
  error: null,
};

// Async thunks
export const loadFormData = createAsyncThunk(
  'formBuilder/loadFormData',
  async (formId) => {
    const formData = await formsService.fetchForm(formId);
    return formData;
  }
);

export const saveFormData = createAsyncThunk(
  'formBuilder/saveFormData',
  async ({ formId, formData }) => {
    const result = await formsService.updateFormStructure(formId, formData);
    return result;
  }
);

const formBuilderSlice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    // Reset form builder
    resetFormBuilder: (state) => {
      state.selectedId = '';
      state.componentList = [];
      state.copiedComponent = null;
      state.pageInfo = {
        title: '未命名表单',
        desc: '',
      };
    },

    // Change selected component
    changeSelectedId: (state, action) => {
      state.selectedId = action.payload;
    },

    // Add new component
    addComponent: (state, action) => {
      const { type, insertIndex } = action.payload;
      const config = COMPONENT_CONFIGS[type];
      if (!config) return;

      const newComponent = {
        fe_id: generateComponentId(),
        type: config.type,
        title: config.title,
        props: { ...config.defaultProps },
        isHidden: false,
        isLocked: false,
      };

      if (insertIndex !== undefined) {
        state.componentList.splice(insertIndex, 0, newComponent);
      } else {
        state.componentList.push(newComponent);
      }
    },

    // Update component props
    changeComponentProps: (state, action) => {
      const { fe_id, newProps } = action.payload;
      const component = state.componentList.find(c => c.fe_id === fe_id);
      if (component) {
        component.props = { ...component.props, ...newProps };
      }
    },

    // Remove selected component
    removeSelectedComponent: (state) => {
      const { componentList, selectedId } = state;
      const index = componentList.findIndex(c => c.fe_id === selectedId);
      if (index !== -1) {
        state.componentList.splice(index, 1);
        // Select next component or clear selection
        if (state.componentList.length > 0) {
          const nextIndex = index < state.componentList.length ? index : index - 1;
          state.selectedId = state.componentList[nextIndex].fe_id;
        } else {
          state.selectedId = '';
        }
      }
    },

    // Copy component
    copySelectedComponent: (state) => {
      const { selectedId, componentList } = state;
      const selectedComponent = componentList.find(c => c.fe_id === selectedId);
      if (selectedComponent) {
        state.copiedComponent = { ...selectedComponent };
      }
    },

    // Paste component
    pasteCopiedComponent: (state) => {
      const { copiedComponent } = state;
      if (copiedComponent) {
        const newComponent = {
          ...copiedComponent,
          fe_id: generateComponentId(),
        };
        state.componentList.push(newComponent);
      }
    },

    // Move component
    moveComponent: (state, action) => {
      const { oldIndex, newIndex } = action.payload;
      const component = state.componentList[oldIndex];
      state.componentList.splice(oldIndex, 1);
      state.componentList.splice(newIndex, 0, component);
    },

    // Toggle component lock
    toggleComponentLocked: (state, action) => {
      const { fe_id } = action.payload;
      const component = state.componentList.find(c => c.fe_id === fe_id);
      if (component) {
        component.isLocked = !component.isLocked;
      }
    },

    // Change component title
    changeComponentTitle: (state, action) => {
      const { fe_id, title } = action.payload;
      const component = state.componentList.find(c => c.fe_id === fe_id);
      if (component) {
        component.title = title;
      }
    },

    // Update page info
    changePageInfo: (state, action) => {
      state.pageInfo = { ...state.pageInfo, ...action.payload };
    },

    // Set form data (for loading)
    setFormData: (state, action) => {
      const { componentList, pageInfo } = action.payload;
      state.componentList = componentList || [];
      state.pageInfo = pageInfo || state.pageInfo;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFormData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadFormData.fulfilled, (state, action) => {
        state.loading = false;
        try {
          // 安全解析JSON，处理undefined或null的情况
          const content = action.payload?.content;
          if (!content) {
            console.warn('Form content is empty, using default values');
            state.componentList = [];
            state.pageInfo = {
              title: action.payload?.title || '未命名表单',
              desc: action.payload?.description || '',
            };
            return;
          }
          
          const formData = JSON.parse(content);
          state.componentList = formData.questions || [];
          state.pageInfo = {
            title: formData.title || action.payload?.title || '未命名表单',
            desc: formData.description || action.payload?.description || '',
          };
        } catch (error) {
          console.error('Failed to parse form content:', error);
          state.componentList = [];
          state.pageInfo = {
            title: action.payload?.title || '未命名表单',
            desc: action.payload?.description || '',
          };
        }
      })
      .addCase(loadFormData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(saveFormData.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveFormData.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(saveFormData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  resetFormBuilder,
  changeSelectedId,
  addComponent,
  changeComponentProps,
  removeSelectedComponent,
  copySelectedComponent,
  pasteCopiedComponent,
  moveComponent,
  toggleComponentLocked,
  changeComponentTitle,
  changePageInfo,
  setFormData,
} = formBuilderSlice.actions;

export default formBuilderSlice.reducer;
