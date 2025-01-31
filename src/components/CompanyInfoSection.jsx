'use client'
import { Button } from "@/components/ui/button";
import { InputWithError } from "@/components/ui/input-with-error";
import { RequiredLabel } from "@/components/ui/required-label";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Icon } from "@iconify/react";
import { useState } from 'react';

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

export const CompanyInfoSection = ({
    formData,
    handleChange,
    validationErrors,
    onContinue,
    setValidationErrors,
    isDisabled,
    companyNameRef,
    className,
    id
}) => {
    const [salaryMethod, setSalaryMethod] = useState('ageBasedIncrease');

    const handleCompanyNameChange = (e) => {
        handleChange(e);
        if (validationErrors.companyName) {
            setValidationErrors(prev => ({
                ...prev,
                companyName: false
            }));
        }
    };

    return (
        <section id={id} className={`${className} space-y-10`}>
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
                                    <TableHead className="text-right">정년나이</TableHead>
                                    <TableHead className="text-right">베이스업</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {jobTypeInfo.map((job) => (
                                    <TableRow key={job.jobType}>
                                        <TableCell className="font-medium">{job.jobType}</TableCell>
                                        <TableCell>{job.jobTypeName}</TableCell>
                                        <TableCell className="text-right">{job.retirementAge}</TableCell>
                                        <TableCell className="text-right">{job.baseUp}%</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-4 gap-4 items-top">
                <RequiredLabel htmlFor="salaryEstimationMethod" className="text-base font-medium text-slate-700">
                    임금상승률 적용방식
                </RequiredLabel>
                <div className="col-span-3 space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer group">
                        <div className="relative">
                            <input
                                type="radio"
                                name="salaryEstimationMethod"
                                value="ageBasedIncrease"
                                checked={salaryMethod === 'ageBasedIncrease'}
                                onChange={(e) => setSalaryMethod(e.target.value)}
                                className="hidden"
                            />
                            <div className="w-5 h-5 border-2 border-gray-300 rounded-full group-hover:border-gray-400">
                                {salaryMethod === 'ageBasedIncrease' && (
                                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                                )}
                            </div>
                        </div>
                        <span className="text-gray-700 group-hover:text-gray-800">연령별승급률+베이스업</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer group">
                        <div className="relative">
                            <input
                                type="radio"
                                name="salaryEstimationMethod"
                                value="continuousService"
                                checked={salaryMethod === 'continuousService'}
                                onChange={(e) => setSalaryMethod(e.target.value)}
                                className="hidden"
                            />
                            <div className="w-5 h-5 border-2 border-gray-300 rounded-full group-hover:border-gray-400">
                                {salaryMethod === 'continuousService' && (
                                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                                )}
                            </div>
                        </div>
                        <span className="text-gray-700 group-hover:text-gray-800">계속재직자법</span>
                    </label>
                </div>
            </div>
            <div className="grid grid-cols-4 gap-4 items-top">
                <RequiredLabel htmlFor="yearsAddedOverRetirement" className="text-base font-medium text-slate-700">
                    정년 초과자 가산연수
                </RequiredLabel>
                <div className="col-span-3">
                    <InputWithError
                        type="number"
                        id="yearsAddedOverRetirement"
                        name="yearsAddedOverRetirement"
                        value={formData.yearsAddedOverRetirement}
                        className="w-1/3"
                    />
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
