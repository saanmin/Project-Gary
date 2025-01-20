'use client'

import Image from "next/image";
import { useState, useEffect } from 'react'

export default function Home() {
  const [companies, setCompanies] = useState([])
  const [formData, setFormData] = useState({
    companyName: '',
    baseDate: new Date().toISOString().split('T')[0],
    companyBondRating: '',
    salaryEstimationMethod: 1,
    yearsAddedOverRetirement: 5,
    isUnder300Employees: 1
  })

  // 회사 정보 조회 함수
  const handleFetchCompanies = async () => {
    try {
      console.log('회사 정보 조회 시작')
      const response = await fetch('/api/pension/company')
      const result = await response.json()
      console.log('조회된 데이터:', result)
      
      if (response.ok) {
        // 성공 시 데이터 설정 (배열 확인)
        setCompanies(Array.isArray(result) ? result : [])
      } else {
        // 에러 발생 시
        alert('조회 실패: ' + (result.error || '알 수 없는 에러'))
        setCompanies([])
      }
      
    } catch (error) {
      console.error('조회 에러:', error)
      alert('조회 중 에러 발생: ' + error.message)
      setCompanies([])
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddCompany = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/pension/company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) {
        throw new Error('회사 정보 추가 실패')
      }

      const result = await response.json()
      alert('회사 정보가 추가되었습니다.')
      
      // 목록 새로고침
      const updatedResponse = await fetch('/api/pension/company')
      const updatedData = await updatedResponse.json()
      setCompanies(updatedData)
      
      // 폼 초기화
      setFormData({
        companyName: '',
        baseDate: new Date().toISOString().split('T')[0],
        companyBondRating: '',
        salaryEstimationMethod: 1,
        yearsAddedOverRetirement: 5,
        isUnder300Employees: 1
      })
      
    } catch (error) {
      console.error('에러 발생:', error)
      alert('에러: ' + error.message)
    }
  }

  // 회사 삭제
  const handleDeleteCompany = async (companyName, baseDate) => {
    try {
      const response = await fetch('/api/pension/company', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ companyName, baseDate })
      })
      
      const result = await response.json()
      alert('회사 삭제 성공!')
      console.log('삭제된 회사:', result)
      
      // 목록 새로고침
      const updatedCompanies = companies.filter(
        company => !(company.companyName === companyName && company.baseDate === baseDate)
      )
      setCompanies(updatedCompanies)
    } catch (error) {
      alert('삭제 중 에러 발생: ' + error.message)
      console.error('삭제 에러:', error)
    }
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">회사 정보 관리</h1>
      
      {/* 회사 정보 입력 폼 */}
      <form onSubmit={handleAddCompany} className="mb-8 space-y-4">
        <div>
          <label className="block mb-1">회사명:</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        
        <div>
          <label className="block mb-1">기준일:</label>
          <input
            type="date"
            name="baseDate"
            value={formData.baseDate}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        
        <div>
          <label className="block mb-1">회사채등급:</label>
          <input
            type="text"
            name="companyBondRating"
            value={formData.companyBondRating}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        
        <div>
          <label className="block mb-1">급여추정방식:</label>
          <select
            name="salaryEstimationMethod"
            value={formData.salaryEstimationMethod}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
          >
            <option value={1}>방식 1</option>
            <option value={2}>방식 2</option>
          </select>
        </div>
        
        <div>
          <label className="block mb-1">정년초과연수:</label>
          <input
            type="number"
            name="yearsAddedOverRetirement"
            value={formData.yearsAddedOverRetirement}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        
        <div>
          <label className="block mb-1">300인이하여부:</label>
          <select
            name="isUnder300Employees"
            value={formData.isUnder300Employees}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
          >
            <option value={1}>예</option>
            <option value={0}>아니오</option>
          </select>
        </div>
        
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          회사 추가
        </button>
      </form>

      {/* 회사 목록 표시 */}
      <h2 className="text-xl font-bold mb-4">회사 목록</h2>
      <div className="space-y-4">
        {companies.map((company) => (
          <div 
            key={`${company.companyName}-${company.baseDate}`}
            className="border p-4 rounded shadow"
          >
            <h3 className="font-bold">{company.companyName}</h3>
            <p>기준일: {new Date(company.baseDate).toISOString().split('T')[0]}</p>
            <p>회사채등급: {company.companyBondRating}</p>
            <p>급여추정방식: {company.salaryEstimationMethod}</p>
            <p>정년초과연수: {company.yearsAddedOverRetirement}</p>
            <p>300인이하여부: {company.isUnder300Employees}</p>
            <button 
              onClick={() => handleDeleteCompany(company.companyName, company.baseDate)}
              className="bg-red-500 text-white px-4 py-2 rounded mt-2 hover:bg-red-600"
            >
              삭제
            </button>
          </div>
        ))}
      </div>
    </main>
  )
}
