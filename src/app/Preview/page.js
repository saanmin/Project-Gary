'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from 'react'
import { useFormContext } from '@/contexts/FormContext'
import { useRouter } from 'next/navigation'
import { Icon } from "@iconify/react"
import LabelValuePair from "@/components/LabelValuePair";

const Page = () => {
    const [isProcessing, setIsProcessing] = useState(false)
    const [isDownloadReady, setIsDownloadReady] = useState(false)
    const { state } = useFormContext()
    const formData = state.formData
    const router = useRouter()

    const handleSubmit = async () => {
        setIsProcessing(true)
        try {
            const response = await fetch('/api/generate-excel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            if (!response.ok) {
                throw new Error('Failed to process data')
            }

            setIsDownloadReady(true)
        } catch (error) {
            console.error('Error processing data:', error)
            alert('데이터 처리 중 오류가 발생했습니다.')
        } finally {
            setIsProcessing(false)
        }
    }

    const handleDownload = async () => {
        try {
            const response = await fetch('/api/download-excel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            if (!response.ok) {
                throw new Error('Failed to download file')
            }

            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${formData.companyName}_결과.xlsx`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
        } catch (error) {
            console.error('Error downloading file:', error)
            alert('파일 다운로드 중 오류가 발생했습니다.')
        }
    }
    const SectionHeader = ({ icon, title }) => (
        <div className="flex items-start gap-2 pt-8">
            <Icon icon={icon} width="18" height="18" className="mt-1" />
            <h2 className="text-lg font-medium">{title}</h2>
        </div>
    );
    return (
        <section className="grid grid-cols-[16rem_1fr] px-8">

            {/* Header */}
            <header className="grid grid-cols-subgrid col-span-2 gap-y-8">
                <h1 className="text-2xl font-semibold pt-8">입력 내용 확인</h1>
                <div className="max-w-[48rem] border-l border-slate-200 space-y-10 pl-8 pt-8"></div>
            </header>

            {/* Company Info Grid */}
            <section className="grid grid-cols-subgrid col-span-2 gap-y-8">
                <SectionHeader icon="heroicons:building-office-2" title="회사 정보" />

                <div className="max-w-[48rem] border-l border-slate-200 pl-8 pt-8 space-y-6">
                    <LabelValuePair label="회사명" value={formData.companyName} />
                    <LabelValuePair label="임금상승률 적용방식" value={formData.salaryEstimationMethod !== 1 ? '계속재직자법' : '연령별승급률+베이스업'} />
                    <LabelValuePair label="정년 초과자 가산연수" value={formData.yearsAddedOverRetirement} />
                </div>
            </section>

            {/* Base Date Grid */}
            <section className="grid grid-cols-subgrid col-span-2 gap-y-8">
                <SectionHeader icon="heroicons:calendar-days" title="기준일 정보" />

                <div className="max-w-[48rem] border-l border-slate-200 pl-8 pt-8 space-y-6">
                    <LabelValuePair label="기준일" value={`${formData.baseDate.split('-')[0]}년 ${formData.baseDate.split('-')[1]}월 ${formData.baseDate.split('-')[2]}일`} />
                    <LabelValuePair label="채권등급" value={formData.companyBondRating} />
                    <LabelValuePair label="기초율" value={formData.useStandardRate ? '표준율' : '경험률'} />
                    <LabelValuePair label="당기 재직자 명부" value={<div className="flex items-center gap-2">

                        {formData.files.currentYear ? (

                            <>
                                <Icon icon="vscode-icons:file-type-excel" width="16" height="16" />
                                <span>{formData.files.currentYear.name}</span>
                            </>
                        ) : (
                            <span className="text-slate-500">N/A</span>
                        )}
                    </div>} />
                </div>
            </section>

            {/* Submit and Download Buttons */}
            <section className="grid grid-cols-subgrid col-span-2">
                <div></div>


                <div className="flex justify-end items-center gap-4 max-w-[48rem] border-l border-slate-200 pl-8 pt-8 pb-10">
                    {!isDownloadReady && (
                        <>
                            <Button
                                variant="outline"
                                onClick={() => router.push('/')}
                            >
                                이전으로
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={isProcessing}
                                className="bg-slate-800 text-white hover:bg-slate-700"
                            >
                                <span className="flex items-center">
                                    {isProcessing && <Icon icon="svg-spinners:180-ring-with-bg" width="16" height="16" className="mr-2" />}
                                    {isProcessing ? '처리 중...' : '제출하기'}
                                </span>
                            </Button>
                        </>

                    )}

                    {isDownloadReady && (
                        <div className="flex justify-end items-center gap-4">
                            <div className="text-sm text-muted-foreground">
                                output.xlsx
                            </div>
                            <Button
                                onClick={handleDownload}
                                className="bg-green-600 text-white hover:bg-green-500 flex items-center gap-2"
                            >
                                <Icon icon="heroicons:arrow-down-tray-20-solid" width="16" height="16" />
                                엑셀 파일 다운로드
                            </Button>
                        </div>
                    )}
                </div>


            </section>
        </section >

    )
}

export default Page
