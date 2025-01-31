import { getLastDayOfPreviousQuarter } from "@/utils/dateUtils";

export const initialState = {
  formData: {
    companyName: '',
    baseDate: getLastDayOfPreviousQuarter(),
    companyBondRating: '',
    salaryEstimationMethod: 1,
    yearsAddedOverRetirement: 0,
    jobTypeInfo: '',
    isUnder300Employees: 1,
    useStandardRate: true,
    files: {
      currentYear: null,
      previousYear: null,
      twoPreviousYear: null,
      threePreviousYear: null
    }
  },
  validationErrors: {
    companyName: false,
    baseDate: false,
    companyBondRating: false,
    currentYearFile: false
  },
  dateError: false,
  showNextSection: false,
  isCompanyInfoDisabled: false,
  activeSection: 'companyInfo'
};

export const formReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_FORM_DATA':
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.field]: action.value
        }
      };

    case 'UPDATE_FILE':
      return {
        ...state,
        formData: {
          ...state.formData,
          files: {
            ...state.formData.files,
            [action.fileType]: action.file
          }
        },
        validationErrors: action.fileType === 'currentYear' ? {
          ...state.validationErrors,
          currentYearFile: !action.file
        } : state.validationErrors
      };

    case 'UPDATE_VALIDATION_ERROR':
      return {
        ...state,
        validationErrors: {
          ...state.validationErrors,
          [action.field]: action.value
        }
      };

    case 'RESET_VALIDATION_ERRORS':
      return {
        ...state,
        validationErrors: action.errors || {
          companyName: false,
          baseDate: false,
          companyBondRating: false,
          currentYearFile: false
        }
      };

    case 'SET_DATE_ERROR':
      return {
        ...state,
        dateError: action.value
      };

    case 'SET_SHOW_NEXT_SECTION':
      return {
        ...state,
        showNextSection: action.value
      };

    case 'SET_COMPANY_INFO_DISABLED':
      return {
        ...state,
        isCompanyInfoDisabled: action.value
      };

    case 'SET_ACTIVE_SECTION':
      return {
        ...state,
        activeSection: action.value
      };

    default:
      return state;
  }
};
