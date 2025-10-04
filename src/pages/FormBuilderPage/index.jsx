import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadFormData, saveFormData } from '../../store/formBuilderSlice';
import FormBuilderLayout from './FormBuilderLayout';
import { ROUTES } from '../../router/routes';

const FormBuilderPage = () => {
  const { formId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { componentList, pageInfo, loading, selectedId } = useSelector(state => state.formBuilder);

  useEffect(() => {
    if (formId) {
      console.log('Loading form data for ID:', formId);
      dispatch(loadFormData(formId)).catch(error => {
        console.error('Failed to load form data:', error);
      });
    }
  }, [formId, dispatch]);

  const handleSave = async () => {
    const formData = {
      title: pageInfo.title,
      description: pageInfo.desc,
      questions: componentList,
    };
    
    try {
      await dispatch(saveFormData({ formId, formData }));
      navigate(ROUTES.HOME);
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  return (
    <FormBuilderLayout 
      onSave={handleSave}
      loading={loading}
    />
  );
};

export default FormBuilderPage;
