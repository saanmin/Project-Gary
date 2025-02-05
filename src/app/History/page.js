'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function HistoryPage() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState('date')
  const router = useRouter()

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch('/api/pension/company')
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
    return (
      <div className="container mx-auto px-8 py-8">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-10 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const filteredSubmissions = submissions
    .filter(submission =>
      submission.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === 'date') {
        return new Date(b.createdAt) - new Date(a.createdAt)
      }
      return a.companyName.localeCompare(b.companyName)
    })

  return (
    <div className="container mx-auto px-8 py-8 min-h-[calc(100vh-theme('spacing.48'))]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">이용 내역</h1>
        <div className="flex gap-4">
          <div className="relative h-fit">
            <Input
              type="text"
              placeholder="회사명 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-60 h-10"
            />
            <Icon icon="heroicons:magnifying-glass-20-solid" width="16" height="16"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <Select
            value={sortOrder}
            onValueChange={setSortOrder}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="정렬 방식" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">생성일순</SelectItem>
              <SelectItem value="name">회사명순</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredSubmissions.map((submission) => (
          <Card
            key={submission.companyId}
            className="hover:bg-accent transition-colors cursor-pointer"
            onClick={() => handleViewDetails(submission.companyName)}
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div className="grid grid-cols-[auto,1fr] gap-y-2 items-center">
                  <span className="text-sm font-semibold text-slate-700 pr-3">회사명</span>
                  <h2 className="font-semibold">{submission.companyName}</h2>
                  <span className="text-sm font-semibold text-slate-700 pr-3">기준일자</span>
                  <p className="text-muted-foreground">
                    {new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long', day: '2-digit' }).format(new Date(submission.baseDate))}
                  </p>
                  <span className="text-sm font-semibold text-slate-700 pr-3">생성일자</span>
                  <p className="text-muted-foreground">
                    {new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long', day: '2-digit' }).format(new Date(submission.createdAt))}
                  </p>
                </div>
                <Button variant="link" className="text-blue-500 gap-1">
                  상세보기
                  <Icon icon="heroicons:arrow-long-right-20-solid" width="16" height="16" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredSubmissions.length === 0 && (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                {searchTerm ? '검색 결과가 없습니다.' : '이용 내역이 없습니다.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
