'use client'
import { useReducer, useEffect, useRef, useCallback } from 'react';
import { CompanyInfoSection } from "@/components/CompanyInfoSection";
import { BaseDateSection } from "@/components/BaseDateSection";
import { useDragDrop } from "@/hooks/useDragDrop";
import { useFormValidation } from "@/hooks/useFormValidation";
import { formReducer, initialState } from "@/reducers/formReducer";
import { formatDateInput, validateDate } from "@/utils/dateUtils";
import { cn } from "@/lib/utils";

const page = () => {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const companyNameRef = useRef(null);
  const dragDropProps = useDragDrop();

  const {
    formData,
    validationErrors,
    dateError,
    showNextSection,
    isCompanyInfoDisabled,
    activeSection
  } = state;

  const { validateCompanyInfo, validateSubmission } = useFormValidation(
    dispatch,
    formData,
    companyNameRef
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            dispatch({ type: 'SET_ACTIVE_SECTION', value: entry.target.id });
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    const sections = document.querySelectorAll('section');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  useEffect(() => {
    if (showNextSection) {
      const baseDataSection = document.getElementById('baseDateInfo');
      if (baseDataSection) {
        baseDataSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [showNextSection]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    dispatch({ type: 'UPDATE_FORM_DATA', field: name, value });
    dispatch({ type: 'UPDATE_VALIDATION_ERROR', field: name, value: false });
  }, []);

  const handleBondRatingChange = useCallback((value) => {
    dispatch({ type: 'UPDATE_FORM_DATA', field: 'bondRating', value });
    dispatch({ type: 'UPDATE_VALIDATION_ERROR', field: 'bondRating', value: false });
  }, []);

  const handleDateChange = useCallback((e) => {
    const input = e.target.value.replace(/\D/g, '');
    const prevInput = formData.baseDate.replace(/\D/g, '');

    const displayValue = formatDateInput(input, prevInput);
    if (displayValue === null) return;

    dispatch({ type: 'UPDATE_FORM_DATA', field: 'baseDate', value: displayValue });

    if (input.length === 8) {
      dispatch({ type: 'SET_DATE_ERROR', value: !validateDate(input) });
    } else {
      dispatch({ type: 'SET_DATE_ERROR', value: false });
    }
  }, [formData.baseDate]);

  const handleFileUpload = useCallback((e, fileType) => {
    const file = e?.target?.files?.[0] || null;
    dispatch({ type: 'UPDATE_FILE', fileType, file });

    if (fileType === 'currentYear') {
      dispatch({
        type: 'UPDATE_VALIDATION_ERROR',
        field: 'currentYearFile',
        value: !file
      });
    }
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (validateSubmission()) {
      console.log('Form submitted:', formData);
    }
  }, [formData, validateSubmission]);

  return (
    <div className="flex min-h-screen relative">
      {/* Left side - Steps */}
      <div className="w-64 px-8 py-10 border-r border-slate-200 sticky top-0 h-screen">
        <div className="sticky top-10 space-y-4">
          <div className={cn("flex items-center space-x-2", {
            'opacity-100': activeSection === 'companyInfo',
            'opacity-40': activeSection !== 'companyInfo'
          })}>
            <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-white text-sm", {
              'bg-slate-800': activeSection === 'companyInfo',
              'bg-slate-300': activeSection !== 'companyInfo'
            })}>1</div>
            <span className="text-sm font-medium">회사 정보 입력</span>
          </div>
          <div className={cn("flex items-center space-x-2", {
            'opacity-100': activeSection === 'baseDateInfo',
            'opacity-40': activeSection !== 'baseDateInfo'
          })}>
            <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-sm", {
              'bg-slate-800 text-white': activeSection === 'baseDateInfo',
              'bg-slate-100 text-slate-500': activeSection !== 'baseDateInfo'
            })}>2</div>
            <span className="text-sm font-medium">기준일 정보 입력</span>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 px-8 py-10">
        <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">

          <CompanyInfoSection
            formData={formData}
            handleChange={handleChange}
            validationErrors={validationErrors}
            onContinue={validateCompanyInfo}
            setValidationErrors={errors => dispatch({ type: 'RESET_VALIDATION_ERRORS', errors })}
            isDisabled={isCompanyInfoDisabled}
            companyNameRef={companyNameRef}
          />

          {showNextSection && (
            <BaseDateSection
              formData={formData}
              handleDateChange={handleDateChange}
              dateError={dateError}
              dragDropProps={dragDropProps}
              handleFileUpload={handleFileUpload}
              setFormData={newData => dispatch({ type: 'UPDATE_FORM_DATA', ...newData })}
              validationErrors={validationErrors}
              handleBondRatingChange={handleBondRatingChange}
            />
          )}
        </form>
      </div>
    </div>
  );
};

export default page;
