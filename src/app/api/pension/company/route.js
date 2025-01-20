import { prisma } from '@/lib/db'



// 회사 정보 조회
async function getCompanies() {
  const companies = await prisma.pensionCompanyInfo.findMany()
  return companies
}

// 특정 회사 정보 조회
async function getCompany(companyName, baseDate) {
  const company = await prisma.pensionCompanyInfo.findUnique({
    where: {
      companyName_baseDate: {
        companyName,
        baseDate: new Date(baseDate)
      }
    }
  })
  return company
}

// 공통 에러 처리 함수
const handleDatabaseError = (error) => {
  console.log('데이터베이스 에러:', error)
  return new Response(JSON.stringify({ 
    error: error.message  // SQL Server의 실제 에러 메시지
  }), {
    status: 500,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

// GET 메서드
export async function GET() {
  try {
    await prisma.$connect()
    const data = await prisma.pensionCompanyInfo.findMany()
    return new Response(JSON.stringify(data || []), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  } finally {
    await prisma.$disconnect()
  }
}

// POST 메서드
export async function POST(request) {
  try {
    const data = await request.json()
    console.log('받은 데이터:', data)

    const result = await prisma.pensionCompanyInfo.create({
      data: {
        companyName: data.companyName,
        baseDate: new Date(data.baseDate).toISOString(),
        companyBondRating: data.companyBondRating,
        salaryEstimationMethod: data.salaryEstimationMethod,
        yearsAddedOverRetirement: data.yearsAddedOverRetirement,
        isUnder300Employees: data.isUnder300Employees
      }
    })
    
    return Response.json(result)
    
  } catch (error) {
    console.log('에러 발생:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { companyName, baseDate } = await request.json()
    console.log('삭제할 데이터:', { companyName, baseDate })

    const result = await prisma.pensionCompanyInfo.delete({
      where: {
        companyName_baseDate: {
          companyName,
          baseDate
        }
      }
    })
    
    console.log('삭제 성공:', result)
    return Response.json(result)
    
  } catch (error) {
    console.error('삭제 중 에러:', error)
    return Response.json({ error: error.message || 'Unknown error' }, { status: 500 })
  }
}