import ResetPasswordForm from '@/features/auth/reset-password-form'
import React, { Suspense } from 'react'

export default function ResetPasswordPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[20px_20px] px-4">
            <Suspense fallback={
                <div className="p-6 bg-white rounded-xl shadow-md text-center">
                    <p className="text-gray-500">Loading...</p>
                </div>
            }>
                <ResetPasswordForm />
            </Suspense>
        </main>
    )
}
