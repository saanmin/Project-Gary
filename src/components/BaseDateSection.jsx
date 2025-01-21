'use client'
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { InputWithError } from "@/components/ui/input-with-error";
import { RequiredLabel } from "@/components/ui/required-label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Icon } from "@iconify/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import FileUpload from "@/components/FileUpload";
import { cn } from "@/lib/utils";

export const BaseDateSection = ({
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
