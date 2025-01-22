'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Building2, Calendar, Download } from "lucide-react"
import { useState } from 'react'
import { useFormContext } from '@/contexts/FormContext'
import { Icon } from "@iconify/react"

const Page = () => {
    const [isProcessing, setIsProcessing] = useState(false)
    const [isDownloadReady, setIsDownloadReady] = useState(false)
    const { state } = useFormContext()
    const formData = state.formData

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

    return (
        <div className="flex min-h-screen relative">
            {/* Left side - Steps */}
            <div className="w-64 px-8 py-10 border-r border-slate-200 sticky top-0 h-screen">
                <div className="sticky top-10 space-y-4">
                    <div className="flex items-center space-x-2 opacity-100">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm bg-slate-800">1</div>
                        <span className="text-sm font-medium">회사 정보</span>
                    </div>
                    <div className="flex items-center space-x-2 opacity-100">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-sm bg-slate-800 text-white">2</div>
                        <span className="text-sm font-medium">기준일 정보</span>
                    </div>
                </div>
            </div>

            {/* Right side - Content */}
            <div className="flex-1 px-8 py-10">
                <div className="max-w-3xl space-y-8">
                    <h1 className="text-2xl font-semibold">입력 내용 확인</h1>

                    {/* Company Info Section */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-2">
                            <Building2 className="w-5 h-5" />
                            <h2 className="text-lg font-medium">회사 정보</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-6">
                                <div className="grid grid-cols-4 gap-4 items-center">
                                    <label className="text-base font-medium text-slate-700">회사명</label>
                                    <div className="text-lg">{formData.companyName}</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Base Date Section */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            <h2 className="text-lg font-medium">기준일 정보</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-6">
                                <div className="grid grid-cols-4 gap-4 items-center">
                                    <label className="text-base font-medium text-slate-700">기준일</label>
                                    <div className="text-lg">
                                        {(() => {
                                            const [year, month, day] = formData.baseDate.split('-')
                                            return `${year}년 ${month}월 ${day}일`
                                        })()}
                                    </div>
                                </div>

                                <div className="grid grid-cols-4 gap-4 items-center">
                                    <label className="text-base font-medium text-slate-700">채권등급</label>
                                    <div className="text-lg">{formData.bondRating}</div>
                                </div>
                                <div className="grid grid-cols-4 gap-4 items-center">
                                    <label className="text-base font-medium text-slate-700">기초율</label>
                                    <div className="text-lg">
                                        {formData.useStandardRate ? '표준율' : '경험률'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Submit and Download Buttons */}
                    <div className="flex justify-end mt-8 space-x-4">
                        {!isDownloadReady && (
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
                                    <Download className="w-4 h-4" />
                                    엑셀 파일 다운로드
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page
