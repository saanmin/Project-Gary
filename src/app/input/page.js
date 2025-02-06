'use client'
import { useEffect, useRef, useCallback } from 'react'
import { CompanyInfoSection } from "@/components/CompanyInfoSection"
import { BaseDateSection } from "@/components/BaseDateSection"
import { useDragDrop } from "@/hooks/useDragDrop"
import { useFormValidation } from "@/hooks/useFormValidation"
import { formatDateInput, validateDate, getPreviousYearDate } from "@/utils/dateUtils"
import { cn } from "@/lib/utils"
import { useFormContext } from '@/contexts/FormContext'
import { useRouter } from 'next/navigation'

const page = () => {
  const { state, dispatch } = useFormContext()
  const router = useRouter()
  const companyNameRef = useRef(null)
  const dragDropProps = useDragDrop()

  const {
    formData,
    validationErrors,
    dateError,
    showNextSection,
    isCompanyInfoDisabled,
    activeSection
  } = state

  const { validateCompanyInfo, validateSubmission } = useFormValidation(
    dispatch,
    formData,
    companyNameRef
  )

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

  const updateValidationError = useCallback((field, hasError) => {
    dispatch({
      type: 'UPDATE_VALIDATION_ERROR',
      field,
      value: hasError
    });
  }, [dispatch]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    dispatch({ type: 'UPDATE_FORM_DATA', field: name, value });

    // 에러가 있었다면 초기화
    if (validationErrors[name]) {
      updateValidationError(name, false);
    }
  }, [dispatch, validationErrors, updateValidationError]);

  const handleDateChange = useCallback((e) => {
    const value = e.target.value;
    dispatch({ type: 'UPDATE_FORM_DATA', field: 'baseDate', value });

    if (value.length === 10) { // YYYY-MM-DD 형식일 때
      const dateWithoutHyphen = value.replace(/-/g, '');
      dispatch({ type: 'SET_DATE_ERROR', value: !validateDate(dateWithoutHyphen) });
    } else {
      dispatch({ type: 'SET_DATE_ERROR', value: false });
    }
  }, [dispatch]);

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
  }, [dispatch]);

  const handleCompanyBondRatingChange = useCallback((value) => {
    dispatch({ type: 'UPDATE_FORM_DATA', field: 'companyBondRating', value });
    dispatch({ type: 'UPDATE_VALIDATION_ERROR', field: 'companyBondRating', value: false });
  }, [dispatch]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    if (validateSubmission()) {
      // Create a copy of formData without modifying the original state
      const updatedFormData = {
        ...formData,
        // Store timestamp in a separate field if needed
        baseDateTimestamp: new Date(formData.baseDate).getTime()
      };

      Object.entries(updatedFormData).forEach(([field, value]) => {
        dispatch({
          type: 'UPDATE_FORM_DATA',
          field,
          value
        });
      });

      router.push('/preview');
    }
  }, [formData, validateSubmission, dispatch, router]);

  const handleContinue = useCallback(() => {
    if (validateCompanyInfo()) {
      dispatch({ type: 'SET_SHOW_NEXT_SECTION', value: true });
      dispatch({ type: 'SET_COMPANY_INFO_DISABLED', value: true });
      dispatch({ type: 'SET_ACTIVE_SECTION', value: 'baseDate' });
    }
  }, [dispatch, validateCompanyInfo]);

  const handleBack = useCallback(() => {
    dispatch({ type: 'SET_SHOW_NEXT_SECTION', value: false });
    dispatch({ type: 'SET_COMPANY_INFO_DISABLED', value: false });
    dispatch({ type: 'SET_ACTIVE_SECTION', value: 'companyInfo' });
  }, [dispatch]);

  return (
    <>
      {/* <div className="sticky top-8 space-y-4">
        <div className={cn("flex items-center space-x-2", {
          'opacity-100': !isCompanyInfoDisabled,
          'opacity-40': isCompanyInfoDisabled
        })}>
          <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-white text-sm text-center", {
            'bg-slate-800': !isCompanyInfoDisabled,
            'bg-slate-300': isCompanyInfoDisabled,
          })}>1</div>
          <span className="font-medium">회사 정보 입력</span>
          </div>
          <div className={cn("flex items-center space-x-2", {
          'opacity-100': isCompanyInfoDisabled,
          'opacity-40': !isCompanyInfoDisabled
        })}>
          <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-sm text-center", {
            'bg-slate-800 text-white': isCompanyInfoDisabled,
            'bg-slate-100 text-slate-500': !isCompanyInfoDisabled,
            })}>2</div>
            <span className="font-medium">기준일 정보 입력</span>
            </div>
            </div> */}

      <form onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-[16rem_1fr] px-8 min-h-screen relative">
          <CompanyInfoSection
            formData={formData}
            handleChange={handleChange}
            validationErrors={validationErrors}
            onContinue={handleContinue}
            setValidationErrors={(field, value) => dispatch({
              type: 'UPDATE_VALIDATION_ERROR',
              field,
              value
            })}
            isDisabled={isCompanyInfoDisabled}
            companyNameRef={companyNameRef}
            className={cn(
              "transition-opacity duration-500",
              !showNextSection && "opacity-100",
              showNextSection && "opacity-60"
            )}
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
              validationErrors={validationErrors}
              handleCompanyBondRatingChange={handleCompanyBondRatingChange}
              handleSubmit={handleSubmit}
              handleBack={handleBack}
              className="section"
              id="baseDateInfo"
            />
          )}
        </div>
      </form>
    </>
  );
};

export default page;
