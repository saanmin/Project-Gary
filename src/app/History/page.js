'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button";

export default function HistoryPage() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch('/api/submissions')
        if (!response.ok) {
          throw new Error('Failed to fetch submissions')
        }
        const data = await response.json()
        setSubmissions(data)
      } catch (error) {
        console.error('Error fetching submissions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSubmissions()
  }, [])

  const handleViewDetails = (submissionId) => {
    router.push(`/preview/${submissionId}`)
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <div className="container mx-auto px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">이용 내역</h1>
      <div className="grid gap-4">
        {submissions.map((submission) => (
          <div
            key={submission.id}
            className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
            onClick={() => handleViewDetails(submission.id)}
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-semibold">{submission.companyName}</h2>
                <p className="text-gray-600">{submission.baseDate}</p>
              </div>
              <Button variant="link" className="text-blue-600">상세보기 →</Button>
            </div>
          </div>
        ))}
        {submissions.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            이용 내역이 없습니다.
          </div>
        )}
      </div>
    </div>
  )
}
