'use client'
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Icon } from "@iconify/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


import { cn } from "@/lib/utils";
import FileUpload from "@/components/FileUpload";
import { useDragDrop } from "@/hooks/useDragDrop";

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

const required = () => {
  return <span className="text-red-500 text-sm font-medium align-top pl-1">*&nbsp;</span>;
}

const CompanyInfoSection = ({ formData, handleChange }) => {
  return (
    <section id="companyInfo" className="space-y-10">
      <h1 className="text-2xl font-semibold mb-6">회사 정보 입력</h1>
      <div className="grid grid-cols-4 gap-4 items-top">
        <Label htmlFor="companyName" className="text-base font-medium text-slate-700">
          회사명
          {required()}
        </Label>
        <div className="col-span-3">
          <Input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            className="w-full"
            placeholder="예) ABC 주식회사"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 items-top">
        <label htmlFor="jobType" className="text-base font-medium text-slate-700">
          직군 정보
          {required()}
        </label>
        <div className="col-span-3">
          <div className="flex justify-end mb-3">
            <Button variant="outline">
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
    </section>
  );
};

const BaseDateSection = ({ formData, handleDateChange, dateError, dragDropProps, handleFileUpload, getPreviousYearDate }) => {
  const [selectedTab, setSelectedTab] = useState("standardRate");

  return (
    <section id="baseDateInfo" className="space-y-10">
      <h1 className="text-2xl font-semibold mb-6">기준일 정보 입력</h1>
      <div className="grid grid-cols-4 gap-4 items-top">
        <Label htmlFor="baseDate" className="text-base font-medium text-slate-700">
          기준일자
          {required()}
        </Label>
        <div className="col-span-3">
          <Input
            type="text"
            id="baseDate"
            name="baseDate"
            value={formData.baseDate}
            onChange={handleDateChange}
            className={`w-1/3 ${dateError ? 'border-red-500' : ''}`}
            placeholder="YYYY-MM-DD"
            maxLength={10}
          />
          {dateError && (
            <p className="text-red-500 text-sm mt-1">정확한 날짜 값을 입력하세요.</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 items-top">
        <div className="flex flex-col">
          <Label htmlFor="baseDate" className="text-base font-medium text-slate-700">
            채권등급
            {required()}
          </Label>
          <span className="text-sm text-slate-500">무보증 공모사채</span>
        </div>
        <div className="col-span-3">
          <Select onValueChange={(value) => setFormData(prev => ({ ...prev, bondRating: value }))}>
            <SelectTrigger className="w-1/3">
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
        <Label htmlFor="baseDate" className="text-base text-slate-700">
          표준율 사용 여부
          {required()}
        </Label>
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
              <TabsTrigger value="historicalRate">경험율</TabsTrigger>
            </TabsList>
            <TabsContent value="standardRate" className="mt-4">300인 미만 사업장에 해당하여, 보험업법에 의한 보험요율산출기관이 산출한 승급률, 임금인상률, 퇴직률을 이용합니다.</TabsContent>
            <TabsContent value="historicalRate" className="mt-4">
              경험율 산출을 위해 과거 재직자 명부를 추가로 업로드해주세요.
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
    </section>
  );
};

const page = () => {
  const [activeSection, setActiveSection] = useState('companyInfo');

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
    return `${year}-${month}-${day}`;
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.companyName || !formData.baseDate || !formData.bondRating || !formData.files.currentYear) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    if (dateError) {
      alert('올바른 날짜를 입력해주세요.');
      return;
    }

    const submission = {
      ...formData,
      submittedAt: new Date().toISOString(),
      id: Date.now()
    };

    // If using historical rate, validate required historical files
    if (!formData.useStandardRate) {
      if (!formData.files.previousYear) {
        alert('경험율 사용 시 최소 1개년 이상의 기말 재직자 명부가 업로드 되어야 합니다.');
        return;
      }
    }

    const existingSubmissions = JSON.parse(localStorage.getItem('submissions') || '[]');
    localStorage.setItem('submissions', JSON.stringify([...existingSubmissions, submission]));

    // Reset form after successful submission
    setFormData({
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
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (e) => {
    // 이전 값과 새로운 값을 비교해서 삭제 중인지 확인
    const isDeleting = e.target.value.length < e.target._prevLength;
    e.target._prevLength = e.target.value.length;

    // 삭제 중일 때는 하이픈까지 함께 지우기
    if (isDeleting && e.target.value.endsWith('-')) {
      const newValue = e.target.value.slice(0, -1);
      setFormData(prev => ({
        ...prev,
        baseDate: newValue
      }));
      return;
    }

    const input = e.target.value.replace(/\D/g, '');
    let formattedDate = input;

    if (input.length >= 4) {
      formattedDate = input.slice(0, 4) + '-' + input.slice(4);
    }
    if (input.length >= 6) {
      formattedDate = formattedDate.slice(0, 7) + '-' + input.slice(6);
    }

    if (input.length > 8) {
      return;
    }

    setFormData(prev => ({
      ...prev,
      baseDate: formattedDate
    }));

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
          <section id="companyInfo">
            <CompanyInfoSection formData={formData} handleChange={handleChange} />
          </section>

          <div className="my-14 flex justify-end">
            <Button
              type="button"
              className=""
              onClick={() => {
                const element = document.getElementById('baseDateInfo');
                const navHeight = document.querySelector('nav').offsetHeight;
                // const offset = navHeight + 20;
                const offset = 20;
                const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({
                  top: elementPosition - offset,
                  behavior: 'smooth'
                });
              }}
            >
              Continue →
            </Button>
          </div>

          <section id="baseDateInfo">
            <BaseDateSection
              formData={formData}
              handleDateChange={handleDateChange}
              dateError={dateError}
              dragDropProps={currentYearDragProps}
              handleFileUpload={handleFileUpload}
              getPreviousYearDate={getPreviousYearDate}
            />
          </section>

          <div className="my-20 flex justify-end">
            <Button type="submit" className="">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default page;
