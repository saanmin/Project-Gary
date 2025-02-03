'use client'
import { FormProvider } from '@/contexts/FormContext'
import Navigation from '@/components/Navigation'

export default function RootLayoutClient({ children }) {
  return (
    <div className="min-h-fit bg-slate-100 py-6">
      <div className="container max-w-screen-xl mx-auto">
        <div className=""><Navigation /></div>
        <FormProvider>
          <div className="bg-white mt-6 rounded-2xl">
            {children}
          </div>
        </FormProvider>
      </div>
    </div>
  )
}
