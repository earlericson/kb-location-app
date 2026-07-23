"use client";

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { confirmPasswordReset } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Adjust to your firebase auth export path
import { AlertCircle, Loader2 } from 'lucide-react';

export default function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const oobCode = searchParams.get('oobCode');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!oobCode) {
            setError('Invalid or missing password reset code.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        setLoading(true);

        try {
            await confirmPasswordReset(auth, oobCode, password);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="p-6 bg-white rounded-xl shadow-md text-center max-w-md w-full">
                <h2 className="text-xl font-bold text-green-600 mb-2">Password Reset Successful!</h2>
                <p className="text-gray-600 mb-4">You can now sign in with your new password.</p>
                <a
                    href="/auth/login"
                    className="inline-block w-full py-2 px-4 bg-[#ed1f24] text-white rounded-lg font-medium hover:bg-[#ed1f24]/90 transition"
                >
                    Go to Login
                </a>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            {/* Header Section */}
            <div className="flex flex-col items-center mb-8">
                {/* <div className="bg-blue-50 p-4 rounded-full mb-4">
          <Lock className="text-blue-600" size={28} />
        </div> */}
                <img src="https://firebasestorage.googleapis.com/v0/b/knockerball-map.firebasestorage.app/o/kblocations%2Fkb-logo.webp?alt=media&token=40a9618b-23d0-42d0-8727-c90f11c78b3f" alt="Knockerball logo" width={120} />
                <h1 className="text-2xl font-bold text-gray-900">Knockerball Map</h1>
                <p className="text-gray-500 text-sm mt-1 text-center">
                    Set new password!
                </p>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="flex items-center gap-2 bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100">
                    <AlertCircle size={18} className="shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700 ml-1">
                        New Password
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all placeholder:text-gray-400"
                        placeholder="••••••••"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700 ml-1">
                        Confirm New Password
                    </label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all placeholder:text-gray-400"
                        placeholder="••••••••"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black hover:opacity-90 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100 disabled:opacity-70 disabled:cursor-not-allowed"
                >

                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            <span>Resetting ...</span>
                        </>
                    ) : (
                        "Reset Password"
                    )}
                </button>
            </form>
        </div>
    );
}