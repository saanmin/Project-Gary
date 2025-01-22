'use client'
import { useReducer, useEffect, useRef, useCallback } from 'react';
import { CompanyInfoSection } from "@/components/CompanyInfoSection";
import { BaseDateSection } from "@/components/BaseDateSection";
import { useDragDrop } from "@/hooks/useDragDrop";
import { useFormValidation } from "@/hooks/useFormValidation";
import { formReducer, initialState } from "@/reducers/formReducer";
import { formatDateInput, validateDate, getPreviousYearDate } from "@/utils/dateUtils";
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

    // showNextSection이 true일 때만 observer를 다시 설정
    if (showNextSection) {

      // 현재 보이는 섹션들의 상태를 저장
      let visibleSections = new Map();

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const entryData = {
              id: entry.target.id,
              isIntersecting: entry.isIntersecting,
              intersectionRatio: entry.intersectionRatio,
              boundingClientRect: entry.boundingClientRect,
              rootBounds: entry.rootBounds
            };

            // 각 섹션의 가시성 상태 업데이트
            if (entry.isIntersecting) {
              visibleSections.set(entry.target.id, entry.intersectionRatio);
            } else {
              visibleSections.delete(entry.target.id);
            }

            // 가장 많이 보이는 섹션을 찾아서 활성화
            let maxRatio = 0;
            let mostVisibleSection = null;

            visibleSections.forEach((ratio, id) => {
              if (ratio > maxRatio) {
                maxRatio = ratio;
                mostVisibleSection = id;
              }
            });

            if (mostVisibleSection) {
              dispatch({ type: 'SET_ACTIVE_SECTION', value: mostVisibleSection });
            }
          });
        },
        {
          root: null,
          rootMargin: '-20% 0px -20% 0px',
          threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        }
      );

      // DOM이 업데이트된 후 sections를 찾아서 observe
      setTimeout(() => {
        const sections = document.querySelectorAll('section[id]');
        sections.forEach((section) => {
          observer.observe(section);
        });
      }, 0);

      return () => {
        const sections = document.querySelectorAll('section[id]');
        sections.forEach((section) => observer.unobserve(section));
      };
    }
  }, [showNextSection]);

  useEffect(() => {
    dispatch({ type: 'SET_ACTIVE_SECTION', value: 'companyInfo' });

    let visibleSections = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const entryData = {
            id: entry.target.id,
            isIntersecting: entry.isIntersecting,
            intersectionRatio: entry.intersectionRatio,
            boundingClientRect: entry.boundingClientRect,
            rootBounds: entry.rootBounds
          };

          if (entry.isIntersecting) {
            visibleSections.set(entry.target.id, entry.intersectionRatio);
          } else {
            visibleSections.delete(entry.target.id);
          }

          let maxRatio = 0;
          let mostVisibleSection = null;

          visibleSections.forEach((ratio, id) => {
            if (ratio > maxRatio) {
              maxRatio = ratio;
              mostVisibleSection = id;
            }
          });

          if (mostVisibleSection) {
            dispatch({ type: 'SET_ACTIVE_SECTION', value: mostVisibleSection });
          }
        });
      },
      {
        root: null,
        rootMargin: '-20% 0px -20% 0px',
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
      }
    );

    const sections = document.querySelectorAll('section[id]');

    sections.forEach((section) => {
      observer.observe(section);
    });

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
    const value = e.target.value;
    console.log("Date changed:", value);
    dispatch({ type: 'UPDATE_FORM_DATA', field: 'baseDate', value });

    if (value.length === 10) { // YYYY-MM-DD 형식일 때
      const dateWithoutHyphen = value.replace(/-/g, '');
      dispatch({ type: 'SET_DATE_ERROR', value: !validateDate(dateWithoutHyphen) });
    } else {
      dispatch({ type: 'SET_DATE_ERROR', value: false });
    }
  }, []);

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
    console.log("Parent handleSubmit called");
    if (validateSubmission()) {
      console.log("Validation passed");
      // baseDate에서 하이픈 제거
      const formattedBaseDate = formData.baseDate.replace(/-/g, '');
      const queryParams = new URLSearchParams({
        companyName: formData.companyName,
        companyType: formData.companyType,
        bondRating: formData.bondRating,
        baseDate: formattedBaseDate
      }).toString();
      console.log("Query params:", queryParams);
      window.location.href = `/Preview?${queryParams}`;
    } else {
      console.log("Validation failed");
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
            className="section"
            id="companyInfo"
          />

          {showNextSection && (
            <BaseDateSection
              formData={formData}
              handleDateChange={handleDateChange}
              dateError={dateError}
              dragDropProps={dragDropProps}
              handleFileUpload={handleFileUpload}
              getPreviousYearDate={getPreviousYearDate}
              setFormData={newData => dispatch({ type: 'UPDATE_FORM_DATA', ...newData })}
              validationErrors={validationErrors}
              handleBondRatingChange={handleBondRatingChange}
              className="section"
              id="baseDateInfo"
            />
          )}
        </form>
      </div>
    </div>
  );
};

export default page;
