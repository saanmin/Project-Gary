'use client'
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { RequiredLabel } from "@/components/ui/required-label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Icon } from "@iconify/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import FileUpload from "@/components/FileUpload";
import InputDate from "@/components/InputDate";
import { cn } from "@/lib/utils";
import { useFormContext } from '@/contexts/FormContext';

export const BaseDateSection = ({
    formData,
    handleDateChange,
    dateError,
    dragDropProps,
    handleFileUpload,
    getPreviousYearDate,
    validationErrors,
    isDisabled,
    handleCompanyBondRatingChange,
    className,
    id,
    handleSubmit,
    handleBack
}) => {
    const [selectedTab, setSelectedTab] = useState("standardRate");
    const { dispatch } = useFormContext();

    return (
        <section id={id} className={cn("grid grid-cols-subgrid col-span-2 gap-y-8 relative h-full", className)}>
            <div className="flex items-start gap-2 sticky top-8 mb-10 z-10 h-fit pt-8">
                <div className={cn("flex items-center space-x-2", {
                    'opacity-100': !isDisabled,
                    'opacity-60': isDisabled
                })}>
                    <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-white text-sm text-center", {
                        'bg-slate-800': !isDisabled,
                        'bg-slate-300': isDisabled,
                    })}>2</div>
                    <h2 className="font-medium">기준일 정보 입력</h2>
                </div>
            </div>
            <div className="max-w-[48rem] border-l border-slate-200 space-y-10 pl-8 pt-8 pb-10">
                <div className="grid grid-cols-4 gap-4 items-top">
                    <RequiredLabel htmlFor="baseDate" className="text-base font-medium text-slate-700">
                        기준일자
                    </RequiredLabel>
                    <div className="col-span-3">
                        <InputDate
                            className="w-1/3"
                            value={formData.baseDate}
                            onChange={handleDateChange}
                            error={validationErrors.baseDate || dateError}
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
                            onValueChange={handleCompanyBondRatingChange}
                            value={formData.companyBondRating}
                        >
                            <SelectTrigger className={cn(
                                "w-1/3",
                                validationErrors.companyBondRating && formData.companyBondRating === "" && "!outline !outline-2 !outline-red-500 focus-visible:!ring-0"
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
                            subLabel={getPreviousYearDate(formData.baseDate, 0)}
                            required={true}
                            {...dragDropProps}
                            onFileChange={(e) => handleFileUpload(e, 'currentYear')}
                            uploadedFile={formData.files.currentYear}
                            onDelete={() => handleFileUpload(null, 'currentYear')}
                            error={validationErrors.currentYearFile}
                            errorMessage="당기말 재직자 명부를 업로드해주세요"
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
                                dispatch({
                                    type: 'UPDATE_FORM_DATA',
                                    payload: {
                                        useStandardRate: value === 'standardRate'
                                    }
                                });
                            }}
                        >
                            <TabsList>
                                <TabsTrigger value="standardRate">표준율</TabsTrigger>
                                <TabsTrigger value="historicalRate">경험률</TabsTrigger>
                            </TabsList>
                            <TabsContent value="standardRate" className="mt-4" />
                            <TabsContent value="historicalRate" className="mt-4" />
                            <Alert className="mt-4">
                                <Icon icon="heroicons:information-circle" width="16" height="16" />
                                {selectedTab === "standardRate" ? (
                                    <>
                                        <AlertTitle>표준율</AlertTitle>
                                        <AlertDescription className="mt-3">
                                            <p>종업원 수 300인 미만 사업장에 적용할 수 있습니다.</p>
                                            <p>보험업법에 의한 보험요율산출기관이 산출한 승급률, 임금인상률 및 퇴직률을 이용합니다.</p>
                                        </AlertDescription>
                                    </>
                                ) : (
                                    <>
                                        <AlertTitle>경험률</AlertTitle>
                                        <AlertDescription className="mt-3">
                                            <p>경험통계를 기초로 산출된 경험승급률, 경험임금인상률 및 경험퇴직률을 이용합니다.</p>
                                            <p>기초율 산정을 위해 당기 이전 재직자 명부를 제출해야 합니다.</p>
                                            <p>제출한 재직자 명부 수에 따라 n개년 경험률을 산출합니다.</p>
                                        </AlertDescription>
                                    </>
                                )}
                            </Alert>
                        </Tabs>
                    </div>

                    {selectedTab === "historicalRate" && (
                        <>
                            <div className="col-span-4">
                                <FileUpload
                                    id="fileUpload2"
                                    label="전기말 재직자 명부"
                                    subLabel={getPreviousYearDate(formData.baseDate, 1)}
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
                                    subLabel={getPreviousYearDate(formData.baseDate, 2)}
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
                                    subLabel={getPreviousYearDate(formData.baseDate, 3)}
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
                    <Button type="button" variant="outline" className="mr-4" onClick={handleBack}>
                        이전으로
                    </Button>
                    <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={(e) => {
                            // Update company type in form data
                            dispatch({
                                type: 'UPDATE_FORM_DATA',
                                payload: {
                                    companyType: selectedTab === 'standardRate' ? 'standard' : 'experience'
                                }
                            });
                            // Call handleSubmit
                            handleSubmit(e);
                        }}
                    >
                        작성 완료
                    </Button>
                </div>
            </div>
        </section>
    );
};
