import { getLastDayOfPreviousQuarter } from "@/utils/dateUtils";

export const initialState = {
  formData: {
    companyName: '',
    jobType: '',
    baseDate: getLastDayOfPreviousQuarter(),
    bondRating: '',
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
    bondRating: false,
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
        }
      };

    case 'SET_DATE_ERROR':
      return {
        ...state,
        dateError: action.value
      };

    case 'UPDATE_VALIDATION_ERROR':
      return {
        ...state,
        validationErrors: {
          ...state.validationErrors,
          [action.field]: action.value
        }
      };

    case 'SET_SHOW_NEXT_SECTION':
      return {
        ...state,
        showNextSection: action.value,
        isCompanyInfoDisabled: action.value
      };

    case 'RESET_VALIDATION_ERRORS':
      return {
        ...state,
        validationErrors: {
          ...state.validationErrors,
          ...action.errors
        }
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
