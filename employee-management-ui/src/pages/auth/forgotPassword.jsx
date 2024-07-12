 import { useState } from "react";
import { toast, ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Layout } from "@/components/account";

export default function ForgotPassword() {
    const [email, setEmail] = useState('');

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8081/api/employees/forgot-password?email=${email}`, {
                method: "GET",
                headers: {'Content-Type': 'application/json'}
            });
            if (response.ok) {
                toast.success('Email sent! Check your inbox.');
            } else {
                const errorText = await response.text();
                toast.error('Failed to send email: ' + errorText);
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
                    onSubmit={handleForgotPassword}
                >
                    <h1 className="mb-8 text-3xl font-semibold text-center">Forgot Password</h1>
                    <label className="w-full mb-2 text-left">Email</label>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="Email"
                        className="w-full p-4 mb-4 border border-gray-300 rounded-lg dark:border-neutral-800"
                    />
                    <button
                        type="submit"
                        className="w-full p-4 mb-4 text-white bg-gradient-to-r from-sky-500 to-blue-500 rounded-lg"
                    >
                        Send Reset Link
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



