import { useCallback } from 'react';

export const useFormValidation = (dispatch, formData, companyNameRef) => {
  const validateCompanyInfo = useCallback(() => {
    const companyNameError = !formData.companyName;
    
    dispatch({
      type: 'RESET_VALIDATION_ERRORS',
      errors: {
        companyName: companyNameError,
        baseDate: false,
        bondRating: false,
        currentYearFile: false
      }
    });

    if (!companyNameError) {
      dispatch({ type: 'SET_SHOW_NEXT_SECTION', value: true });
    } else {
      companyNameRef.current?.focus();
    }

    return !companyNameError;
  }, [formData.companyName, dispatch, companyNameRef]);

  const validateSubmission = useCallback(() => {
    const newValidationErrors = {
      baseDate: !formData.baseDate,
      bondRating: !formData.bondRating,
      currentYearFile: !formData.files.currentYear
    };

    console.log("Validation details:", {
      baseDate: formData.baseDate,
      bondRating: formData.bondRating,
      currentYearFile: formData.files.currentYear,
      errors: newValidationErrors
    });

    dispatch({
      type: 'RESET_VALIDATION_ERRORS',
      errors: newValidationErrors
    });

    return !Object.values(newValidationErrors).some(error => error);
  }, [formData.baseDate, formData.bondRating, formData.files.currentYear, dispatch]);

  return {
    validateCompanyInfo,
    validateSubmission
  };
};
