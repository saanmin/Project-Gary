'use client'
import { useSearchParams } from 'next/navigation'
import { cn } from "@/lib/utils"

const Page = () => {
    const searchParams = useSearchParams()

    // Get form data from URL params
    const formData = {
        companyName: searchParams.get('companyName'),
        companyType: searchParams.get('companyType'),
        employeeCount: searchParams.get('employeeCount'),
        bondRating: searchParams.get('bondRating'),
        baseDate: searchParams.get('baseDate')
    }

    return (
        <div className="flex min-h-screen relative">
            {/* Summary Container */}
            <div className="flex-1 px-8 py-10 max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold mb-8">입력 내용 확인</h1>

                {/* Company Info Section */}
                <section className="mb-8">
                    <h2 className="text-lg font-semibold mb-4">회사 정보</h2>
                    <div className="space-y-2">
                        <p>회사명: {formData.companyName}</p>
                        <p>기업 유형: {formData.companyType}</p>
                        <p>상시 근로자 수: {formData.employeeCount}</p>
                        <p>채권등급: {formData.bondRating}</p>
                    </div>
                </section>

                {/* Base Date Section */}
                <section>
                    <h2 className="text-lg font-semibold mb-4">기준일 정보</h2>
                    <div className="space-y-2">
                        <p>기준일: {formData.baseDate}</p>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Page