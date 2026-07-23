"use client";

import { useState } from "react";
import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { Loader2, Lock, AlertCircle, MoveLeft } from "lucide-react";
import { auth } from "@/lib/firebase";

interface ForgotPasswordProps {
    onBackToLogin: () => void;
}

export const ForgotPasswordForm = ({ onBackToLogin }: ForgotPasswordProps) => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     setError('');
    //     setMessage('');

    //     if (!email) {
    //         setError('Please enter your email address.');
    //         return;
    //     }

    //     try {
    //         setLoading(true);
    //         const auth = getAuth();
    //         await sendPasswordResetEmail(auth, email);
    //         setMessage('If an account exists with this email, a password reset link has been sent.');
    //         setIsSubmitted(true);
    //     } catch (err: any) {
    //         if (err.code === 'auth/user-not-found') {
    //             setError('No account found with this email address.');
    //         } else {
    //             setError(err.message || 'Failed to send reset email.');
    //         }
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleResetRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            const actionCodeSettings = {
                // Dynamically uses http://localhost:3000/auth/reset-password locally 
                // and your https://your-app.vercel.app/auth/reset-password on production!
                url: `${window.location.origin}/reset-password`,
                handleCodeInApp: true,
            };

            await sendPasswordResetEmail(auth, email, actionCodeSettings);
            setMessage("If an account exists with this email, a password reset link has been sent.");
            setIsSubmitted(true);
        } catch (err: any) {
            console.error("Error sending password reset email:", err);
            setError(err.message || "Failed to send reset email. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            {/* Header Section */}
            <div className="flex flex-col items-center mb-8">
                {/* <div className="bg-blue-50 p-4 rounded-full mb-4">
          <Lock className="text-blue-600" size={28} />
        </div> */}
                <img src="https://firebasestorage.googleapis.com/v0/b/knockerball-map.firebasestorage.app/o/kblocations%2Fkb-logo.webp?alt=media&token=40a9618b-23d0-42d0-8727-c90f11c78b3f" alt="Knockerball logo" width={120} />
                <h1 className="text-2xl font-bold text-gray-900">
                    {isSubmitted
                        ? "Submitted"
                        : "Reset Password"}


                </h1>
                <p className="text-gray-500 text-sm mt-1 text-center">
                    {isSubmitted
                        ? "We've sent the instructions to your email."
                        : "Enter your email address and we'll send you a link to reset your password."}
                </p>
            </div>

            {message && (
                <div className="p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg">
                    {message}
                </div>
            )}
            {error && (
                <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                    {error}
                </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleResetRequest} className="space-y-5">

                {!isSubmitted && (
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700 ml-1">
                            Email Address
                        </label>
                        <input
                            required
                            type="email"
                            autoComplete="email"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all placeholder:text-gray-400"
                            placeholder="admin@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                )}

                {!isSubmitted && (
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black hover:opacity-90 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                <span>Sending link...</span>
                            </>
                        ) : (
                            "Send Reset Link"
                        )}
                    </button>
                )}

            </form>

            <div className="mt-6 justify-center flex">
                <button
                    type="button"
                    onClick={onBackToLogin}
                    className="flex items-center gap-2 justify-center text-sm font-medium text-black hover:underline"
                >
                    <MoveLeft size={20} /> Back to Login
                </button>
            </div>
        </div>
    );
};