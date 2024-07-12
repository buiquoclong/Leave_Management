"use client";
// pages/auth/reset-password.jsx

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast, ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Layout } from '@/components/account';

export default function ResetPassword() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // useEffect(() => {
    //     const { token, employeeId } = router.query;
    //     if (!token || !employeeId) {
    //         // Nếu không có token hoặc employeeId, điều hướng về trang login hoặc trang thông báo lỗi
    //         router.push('/auth/login');
    //     }
    // }, [router.query]);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }

        const { token, employeeId } = router.query;

        try {
            const response = await fetch("http://localhost:8081/api/employees/reset-password", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, employeeId, password })
            });

            if (response.ok) {
                toast.success('Password reset successful!');
                router.push('/auth/login'); // Điều hướng về trang đăng nhập sau khi đổi mật khẩu thành công
            } else {
                toast.error('Failed to reset password.');
            }
        } catch (err) {
            toast.error('Failed: ' + err.message);
        }
    };

    return (
        <Layout>
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
                <form 
                    className="flex flex-col items-center justify-between w-full max-w-md p-8 bg-white rounded-xl shadow-lg dark:bg-zinc-800/30"
                    onSubmit={handleResetPassword}
                >
                    <h1 className="mb-8 text-3xl font-semibold text-center">Reset Password</h1>
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        placeholder="New Password"
                        className="w-full p-4 mb-4 border border-gray-300 rounded-lg dark:border-neutral-800"
                    />
                    <input
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        type="password"
                        placeholder="Confirm New Password"
                        className="w-full p-4 mb-4 border border-gray-300 rounded-lg dark:border-neutral-800"
                    />
                    <button
                        type="submit"
                        className="w-full p-4 mb-4 text-white bg-gradient-to-r from-sky-500 to-blue-500 rounded-lg"
                    >
                        Reset Password
                    </button>
                </form>
                <ToastContainer
                    className="toast-container"
                    toastClassName="toast"
                    bodyClassName="toast-body"
                    progressClassName="toast-progress"
                    theme='colored'
                    transition={Zoom}
                    autoClose={5000}
                    hideProgressBar={true}
                ></ToastContainer>
            </main>
        </Layout>
    );
}



