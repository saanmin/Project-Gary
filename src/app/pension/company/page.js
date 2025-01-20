'use client'  // 클라이언트 컴포넌트 선언

export default function CompanyPage() {
  const handleAddCompany = async () => {
    try {
      const testData = {
        companyName: "테스트회사",
        baseDate: new Date().toISOString(),  // 날짜 형식 수정
        companyBondRating: "AA",
        salaryEstimationMethod: 1,
        yearsAddedOverRetirement: 5,
        isUnder300Employees: 1
      }

      const response = await fetch('/api/pension/company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      })
      
      const result = await response.json()
      alert('회사 추가 성공!')
      console.log('추가된 회사:', result)
    } catch (error) {
      alert('에러 발생: ' + error.message)
      console.error('에러:', error)
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">회사 정보 관리</h1>
      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleAddCompany}
      >
        테스트 회사 추가
      </button>
    </div>
  )
}
