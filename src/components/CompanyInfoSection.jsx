'use client'
import { Button } from "@/components/ui/button";
import { InputWithError } from "@/components/ui/input-with-error";
import { RequiredLabel } from "@/components/ui/required-label";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
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
    id,
    gridArea
}) => {
    return (
        <section id={id} className={cn("grid grid-cols-subgrid col-span-2 gap-y-8 relative h-full mb-10 border-b border-slate-200", className)}>
            <div className="flex items-start gap-2 sticky top-8 mb-10 z-10 h-fit pt-8">
                <div className={cn("flex items-center space-x-2", {
                    'opacity-100': !isDisabled,
                    'opacity-60': isDisabled
                })}>
                    <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-white text-sm text-center", {
                        'bg-slate-800': !isDisabled,
                        'bg-slate-300': isDisabled,
                    })}>1</div>
                    <h2 className="font-medium">회사 정보 입력</h2>
                </div>
            </div>
            {/* <h2 className="text-2xl font-semibold mb-6">회사 정보 입력</h2> */}

            <div className="max-w-[48rem] border-l border-slate-200 space-y-10 pl-8 pt-8">
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
                            onChange={handleChange}
                            className="w-full"
                            placeholder="예) ABC 주식회사"
                            error={validationErrors.companyName}
                            disabled={isDisabled}
                        />
                        {validationErrors.companyName && (
                            <p className="mt-1 text-sm text-red-500">회사명을 입력해주세요</p>
                        )}
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
                        <label className={`flex items-center w-fit space-x-3 ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'} group`}>
                            <div className="relative">
                                <input
                                    type="radio"
                                    name="salaryEstimationMethod"
                                    checked={formData.salaryEstimationMethod === 1}
                                    onChange={(e) => {
                                        handleChange({
                                            target: {
                                                name: 'salaryEstimationMethod',
                                                value: 1
                                            }
                                        });
                                    }}
                                    className="hidden"
                                    disabled={isDisabled}
                                />
                                <div className={`w-5 h-5 border-2 border-gray-300 rounded-full ${!isDisabled && 'group-hover:border-gray-400'}`}>
                                    {formData.salaryEstimationMethod === 1 && (
                                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                                    )}
                                </div>
                            </div>
                            <span className={`text-gray-700 ${!isDisabled && 'group-hover:text-gray-800'}`}>연령별승급률+베이스업</span>
                        </label>
                        <label className={`flex items-center w-fit space-x-3 ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'} group`}>
                            <div className="relative">
                                <input
                                    type="radio"
                                    name="salaryEstimationMethod"
                                    checked={formData.salaryEstimationMethod === 2}
                                    onChange={(e) => {
                                        handleChange({
                                            target: {
                                                name: 'salaryEstimationMethod',
                                                value: 2
                                            }
                                        });
                                    }}
                                    className="hidden"
                                    disabled={isDisabled}
                                />
                                <div className={`w-5 h-5 border-2 border-gray-300 rounded-full ${!isDisabled && 'group-hover:border-gray-400'}`}>
                                    {formData.salaryEstimationMethod === 2 && (
                                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                                    )}
                                </div>
                            </div>
                            <span className={`text-gray-700 ${!isDisabled && 'group-hover:text-gray-800'}`}>계속재직자법</span>
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
                            onChange={handleChange}
                            className="w-1/3 text-right"
                            disabled={isDisabled}
                        />
                    </div>
                </div>
                <div className="mt-4 flex justify-end">
                    <Button type="button" onClick={onContinue} variant="default" disabled={isDisabled}>
                        계속하기
                    </Button>
                </div>
            </div>
        </section>

    );
};
