import { NextResponse } from 'next/server'

export async function GET() {
    try {
        // TODO: 실제 데이터베이스나 저장소에서 제출 데이터를 가져오는 로직 구현
        // 현재는 예시 데이터를 반환
        const submissions = [
            {
                id: '1',
                companyName: '테스트 회사 1',
                baseDate: '2024-01-22',
                // 기타 필요한 데이터
            },
            {
                id: '2',
                companyName: '테스트 회사 2',
                baseDate: '2024-01-21',
                // 기타 필요한 데이터
            },
        ]
        
        return NextResponse.json(submissions)
    } catch (error) {
        console.error('Error fetching submissions:', error)
        return NextResponse.json(
            { error: 'Failed to fetch submissions' },
            { status: 500 }
        )
    }
}
