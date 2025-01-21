'use client'
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { InputWithError } from "@/components/ui/input-with-error";
import { Label } from "@/components/ui/label";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Icon } from "@iconify/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RequiredLabel } from "@/components/ui/required-label";

import { cn } from "@/lib/utils";
import FileUpload from "@/components/FileUpload";
import { useDragDrop } from "@/hooks/useDragDrop";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const jobTypeInfo = [{
  jobType: 1,
  jobTypeName: '직원',
  retirementAge: 60,
  baseUp: '2'
}, {
  jobType: 2,
  jobTypeName: '임원',
  retirementAge: 0,
  baseUp: '2'
}];

const CompanyInfoSection = ({ formData, handleChange, validationErrors, onContinue, setValidationErrors, isDisabled, companyNameRef }) => {
  const handleCompanyNameChange = (e) => {
    handleChange(e);
    // Reset validation error when typing starts
    if (validationErrors.companyName) {
      setValidationErrors(prev => ({
        ...prev,
        companyName: false
      }));
    }
  };

  return (
    <section id="companyInfo" className="space-y-10">
      <h1 className="text-2xl font-semibold mb-6">회사 정보 입력</h1>
      <div className="grid grid-cols-4 gap-4 items-top">
        <RequiredLabel htmlFor="companyName" className="text-base font-medium text-slate-700">
          회사명
        </RequiredLabel>
        <div className="col-span-3">
          <InputWithError
            ref={companyNameRef}
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleCompanyNameChange}
            className="w-full"
            placeholder="예) ABC 주식회사"
            error={validationErrors.companyName}
            disabled={isDisabled}
          />

        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 items-top">
        <RequiredLabel htmlFor="jobType" className="text-base font-medium text-slate-700">
          직군 정보
        </RequiredLabel>
        <div className="col-span-3">
          <div className="flex justify-end mb-3">
            <Button variant="outline" disabled={isDisabled}>
              <Icon icon="vscode-icons:file-type-excel" width="16" height="16" />일괄 업로드
            </Button>
          </div>
          <div className="w-full border rounded-md overflow-hidden shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[100px]">직군코드</TableHead>
                  <TableHead>직군명</TableHead>
                  <TableHead>정년나이</TableHead>
                  <TableHead className="text-right">베이스업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobTypeInfo.map((job) => (
                  <TableRow key={job.jobType}>
                    <TableCell className="font-medium">{job.jobType}</TableCell>
                    <TableCell>{job.jobTypeName}</TableCell>
                    <TableCell>{job.retirementAge}</TableCell>
                    <TableCell className="text-right">{job.baseUp}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button type="button" onClick={onContinue} variant="default" disabled={isDisabled}>
          계속하기
        </Button>
      </div>
    </section>

  );
};

const BaseDateSection = ({
  formData,
  handleDateChange,
  dateError,
  dragDropProps,
  handleFileUpload,
  getPreviousYearDate,
  setFormData,
  validationErrors,
  handleBondRatingChange
}) => {
  const [selectedTab, setSelectedTab] = useState("standardRate");

  return (
    <section id="baseDateInfo" className="space-y-10">
      <h1 className="text-2xl font-semibold mb-6">기준일 정보 입력</h1>
      <div className="grid grid-cols-4 gap-4 items-top">
        <RequiredLabel htmlFor="baseDate" className="text-base font-medium text-slate-700">
          기준일자
        </RequiredLabel>
        <div className="col-span-3">
          <InputWithError
            type="text"
            id="baseDate"
            name="baseDate"
            value={formData.baseDate}
            onChange={handleDateChange}
            className="w-1/3"
            error={validationErrors.baseDate || dateError}
            placeholder="YYYY-MM-DD"
          />
          {dateError && (
            <p className="text-red-500 text-sm mt-2">유효하지 않은 날짜입니다</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 items-top">
        <div className="flex flex-col">
          <RequiredLabel htmlFor="baseDate" className="text-base font-medium text-slate-700">
            채권등급
          </RequiredLabel>
          <span className="text-sm text-slate-500">무보증 공모사채</span>
        </div>
        <div className="col-span-3 relative">
          <Select
            onValueChange={handleBondRatingChange}
            value={formData.bondRating}
          >
            <SelectTrigger className={cn(
              "w-1/3",
              validationErrors.bondRating && formData.bondRating === "" && "!outline !outline-2 !outline-red-500 focus-visible:!ring-0"
            )}>
              <SelectValue placeholder="회사채 등급" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AAA">AAA</SelectItem>
              <SelectItem value="AA+">AA+</SelectItem>
              <SelectItem value="AA0">AA0</SelectItem>
              <SelectItem value="AA-">AA-</SelectItem>
              <SelectItem value="A+">A+</SelectItem>
              <SelectItem value="A0">A0</SelectItem>
              <SelectItem value="A-">A-</SelectItem>
              <SelectItem value="BBB+">BBB+</SelectItem>
              <SelectItem value="BBB0">BBB0</SelectItem>
              <SelectItem value="BBB-">BBB-</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 items-top">
        <div className="col-span-4">
          <FileUpload
            id="fileUpload"
            label="당기말 재직자 명부"
            subLabel={`기준일자: ${formData.baseDate}`}
            required={true}
            {...dragDropProps}
            onFileChange={(e) => handleFileUpload(e, 'currentYear')}
            uploadedFile={formData.files.currentYear}
            onDelete={() => handleFileUpload(null, 'currentYear')}
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 items-top">
        <RequiredLabel htmlFor="baseDate" className="text-base text-slate-700">
          표준율 사용 여부
        </RequiredLabel>
        <div className="col-span-3">
          <Tabs
            defaultValue="standardRate"
            className=""
            onValueChange={(value) => {
              setSelectedTab(value);
              setFormData(prev => ({
                ...prev,
                useStandardRate: value === 'standardRate'
              }));
            }}
          >
            <TabsList>
              <TabsTrigger value="standardRate">표준율</TabsTrigger>
              <TabsTrigger value="historicalRate">경험률</TabsTrigger>
            </TabsList>
            <TabsContent value="standardRate" className="mt-4">
              <Alert>
                <Icon icon="heroicons:information-circle" width="16" height="16" />
                <AlertTitle>표준율</AlertTitle>
                <AlertDescription className="mt-3">
                  <p>종업원 수 300인 미만 사업장에 적용할 수 있습니다.</p>
                  <p>보험업법에 의한 보험요율산출기관이 산출한 승급률, 임금인상률 및 퇴직률을 이용합니다.</p>
                </AlertDescription>
              </Alert>


            </TabsContent>
            <TabsContent value="historicalRate" className="mt-4">
              <Alert>
                <Icon icon="heroicons:information-circle" width="16" height="16" />
                <AlertTitle>경험률</AlertTitle>
                <AlertDescription className="mt-3">
                  <p>경험통계를 기초로 산출된 경험승급률, 경험임금인상률 및 경험퇴직률을 이용합니다.</p>
                  <p>기초율 산정을 위해 당기 이전 재직자 명부를 제출해야 합니다.</p>
                  <p>제출한 재직자 명부 수에 따라 n개년 경험률을 산출합니다.</p>
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </div>

        {selectedTab === "historicalRate" && (
          <>
            <div className="col-span-4">
              <FileUpload
                id="fileUpload2"
                label="전기말 재직자 명부"
                subLabel={`기준일자: ${getPreviousYearDate(formData.baseDate, 1)}`}
                {...dragDropProps}
                onFileChange={(e) => handleFileUpload(e, 'previousYear')}
                uploadedFile={formData.files.previousYear}
                onDelete={() => handleFileUpload(null, 'previousYear')}
              />
            </div>

            <div className="col-span-4">
              <FileUpload
                id="fileUpload3"
                label="전전기말 재직자 명부"
                subLabel={`기준일자: ${getPreviousYearDate(formData.baseDate, 2)}`}
                {...dragDropProps}
                onFileChange={(e) => handleFileUpload(e, 'twoPreviousYear')}
                uploadedFile={formData.files.twoPreviousYear}
                onDelete={() => handleFileUpload(null, 'twoPreviousYear')}
              />
            </div>

            <div className="col-span-4">
              <FileUpload
                id="fileUpload4"
                label="전전전기말 재직자 명부"
                subLabel={`기준일자: ${getPreviousYearDate(formData.baseDate, 3)}`}
                {...dragDropProps}
                onFileChange={(e) => handleFileUpload(e, 'threePreviousYear')}
                uploadedFile={formData.files.threePreviousYear}
                onDelete={() => handleFileUpload(null, 'threePreviousYear')}
              />
            </div>
          </>
        )}
      </div>
      <div className="my-20 flex justify-end">
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          제출하기
        </Button>
      </div>
    </section>
  );
};

const page = () => {
  const [activeSection, setActiveSection] = useState('companyInfo');
  const companyNameRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
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

  const getLastDayOfPreviousQuarter = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const quarterMonth = Math.floor(currentMonth / 3) * 3;
    const lastDay = new Date(currentYear, quarterMonth, 0);
    const year = lastDay.getFullYear();
    const month = String(lastDay.getMonth() + 1).padStart(2, '0');
    const day = String(lastDay.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  };

  const getPreviousYearDate = (dateString, yearsBack = 1) => {
    const [year, month, day] = dateString.split('-');
    return `${parseInt(year) - yearsBack}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    companyName: '',
    jobType: jobTypeInfo,
    baseDate: getLastDayOfPreviousQuarter(),
    bondRating: '',
    useStandardRate: true,
    files: {
      currentYear: null,
      previousYear: null,
      twoPreviousYear: null,
      threePreviousYear: null
    }
  });
  const [dateError, setDateError] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [validationErrors, setValidationErrors] = useState({
    companyName: false,
    baseDate: false,
    bondRating: false,
    currentYearFile: false
  });

  const [showNextSection, setShowNextSection] = useState(false);
  const [isCompanyInfoDisabled, setIsCompanyInfoDisabled] = useState(false);

  useEffect(() => {
    if (showNextSection) {
      const baseDataSection = document.getElementById('baseDateInfo');
      if (baseDataSection) {
        baseDataSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [showNextSection]);

  const handleContinue = () => {
    const companyNameError = !formData.companyName;
    setValidationErrors(prev => ({
      ...prev,
      companyName: companyNameError,
      baseDate: false,
      bondRating: false,
      currentYearFile: false
    }));

    if (!companyNameError) {
      setShowNextSection(true);
      setIsCompanyInfoDisabled(true);
    } else {
      // Focus on company name input when there's an error
      companyNameRef.current.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted');

    // Reset validation errors (excluding companyName)
    const newValidationErrors = {
      ...validationErrors,
      baseDate: !formData.baseDate,
      bondRating: !formData.bondRating,
      currentYearFile: !formData.files.currentYear
    };

    setValidationErrors(newValidationErrors);

    // Check if there are any errors (excluding companyName)
    if (Object.values(newValidationErrors).some(error => error)) {
      console.log('Form has errors');
      return;
    }

    // Proceed with form submission
    console.log('Form data:', formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error for the changed field
    setValidationErrors(prev => ({
      ...prev,
      [name]: false
    }));
  };

  // Add handler for bond rating change
  const handleBondRatingChange = (value) => {
    setFormData(prev => ({
      ...prev,
      bondRating: value
    }));
    setValidationErrors(prev => ({
      ...prev,
      bondRating: false
    }));
  };
  const handleDateChange = (e) => {
    const input = e.target.value.replace(/\D/g, '');
    const prevInput = formData.baseDate.replace(/\D/g, '');

    // 삭제 동작 감지
    const isDeleting = input.length < prevInput.length;

    if (input.length > 8) {
      return;
    }

    // 표시를 위한 값 포맷팅
    let displayValue = input;
    if (input.length >= 4) {
      displayValue = input.slice(0, 4) + ' - ' + input.slice(4);
    }
    if (input.length >= 6 && !isDeleting) {
      displayValue = displayValue.slice(0, 9) + ' - ' + input.slice(6);
    }

    // 삭제 시 하이픈 제거
    if (isDeleting) {
      if (input.length === 4) {
        displayValue = input.slice(0, 4);
      } else if (input.length === 6) {
        displayValue = input.slice(0, 4) + ' - ' + input.slice(4, 6);
      }
    }

    setFormData(prev => ({
      ...prev,
      baseDate: displayValue
    }));

    // 유효성 검사 (숫자만 사용)
    if (input.length === 8) {
      const year = parseInt(input.slice(0, 4));
      const month = parseInt(input.slice(4, 6));
      const day = parseInt(input.slice(6, 8));

      const date = new Date(year, month - 1, day);
      const isValid = date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day;

      setDateError(!isValid);
    } else {
      setDateError(false);
    }
  };
  const handleFileUpload = (e, fileType) => {
    if (!e) {
      setFormData(prev => ({
        ...prev,
        files: {
          ...prev.files,
          [fileType]: null
        }
      }));
      return;
    }

    let file;
    if (e instanceof File) {
      // Drag & Drop case
      file = e;
    } else if (e.target?.files?.length) {
      // Input change event case
      file = e.target.files[0];
    } else {
      return;
    }

    const extension = file.name.split('.').pop().toLowerCase();
    if (['xlsx', 'xls', 'csv'].includes(extension)) {
      setFormData(prev => ({
        ...prev,
        files: {
          ...prev.files,
          [fileType]: file
        }
      }));
    } else {
      alert('지원하지 않는 파일 형식입니다.');
    }
  };

  const createDragDropProps = (fileType) => {
    return useDragDrop((file) => handleFileUpload(file, fileType));
  };

  const currentYearDragProps = createDragDropProps('currentYear');
  const previousYearDragProps = createDragDropProps('previousYear');
  const twoPreviousYearDragProps = createDragDropProps('twoPreviousYear');
  const threePreviousYearDragProps = createDragDropProps('threePreviousYear');

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
            onContinue={handleContinue}
            setValidationErrors={setValidationErrors}
            isDisabled={isCompanyInfoDisabled}
            companyNameRef={companyNameRef}
          />


          {showNextSection && (

            <BaseDateSection
              formData={formData}
              handleDateChange={handleDateChange}
              dateError={dateError}
              dragDropProps={currentYearDragProps}
              handleFileUpload={handleFileUpload}
              getPreviousYearDate={getPreviousYearDate}
              setFormData={setFormData}
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
