import { NextResponse } from 'next/server'

export async function POST(request) {
    try {
        const formData = await request.json()
        
        // 여기서 backend API로 데이터를 전송합니다
        // TODO: backend API endpoint URL을 환경변수로 관리하세요
        const backendResponse = await fetch('http://your-backend-url/api/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        
        if (!backendResponse.ok) {
            throw new Error('Backend API error')
        }
        
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error submitting form:', error)
        return NextResponse.json(
            { error: 'Failed to submit form' },
            { status: 500 }
        )
    }
}
