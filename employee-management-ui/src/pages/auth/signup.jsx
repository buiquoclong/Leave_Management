"use client";
import { useState } from "react";
import { toast, ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation'
import { Layout } from "@/components/account";
import Link from "next/link";

export default function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [position, setPosition] = useState('');
    // const [dayOffRemaining, setDayOffRemaining] = useState(0);
    // const [firstDayOfWork, setFirstDayOfWork] = useState('');

    const router = useRouter();

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }
        const employeeDTO = {
            username,
            password,
            email,
            fullName,
            position,
            // dayOffRemaining,
            // firstDayOfWork,
        };

        try {
            const response = await fetch("http://localhost:8081/api/employees", {
                method: "POST",
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(employeeDTO)
            });

            if (response.ok) {
                toast.success('Account created successfully');
                router.push('/auth/login');
            } else {
                const errorData = await response.json();
                if (errorData && errorData.message) {
                    toast.error('Failed to create account: ' + errorData.message);
                } else {
                    toast.error('Failed to create account: Unknown error');
                }
            }
        } catch (err) {
            toast.error('Failed: ' + err.message);
        }
    };

    const validate = () => {
        let result = true;

        if (!username || !password || !email || !fullName || !position ) {
            result = false;
            toast.error('Please fill out all fields');
        }

        if (password.length < 8) {
            result = false;
            toast.error('Password must be at least 8 characters long');
        }

        return result;
    };

    return (
        <>
            <Layout>
                <main className="flex min-h-screen flex-col items-center justify-between p-24">
                    <form
                        className="flex flex-col items-center justify-between w-full max-w-md p-8 bg-white rounded-xl shadow-lg dark:bg-zinc-800/30"
                        onSubmit={handleSignup}
                    >
                        <h1 className="mb-8 text-3xl font-semibold text-center">Sign Up</h1>
                        <input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            type="text"
                            placeholder="Username"
                            className="w-full p-4 mb-4 border border-gray-300 rounded-lg dark:border-neutral-800"
                        />
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            placeholder="Password"
                            className="w-full p-4 mb-4 border border-gray-300 rounded-lg dark:border-neutral-800"
                        />
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="Email"
                            className="w-full p-4 mb-4 border border-gray-300 rounded-lg dark:border-neutral-800"
                        />
                        <input
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            type="text"
                            placeholder="Full Name"
                            className="w-full p-4 mb-4 border border-gray-300 rounded-lg dark:border-neutral-800"
                        />
                        <input
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            type="text"
                            placeholder="Position"
                            className="w-full p-4 mb-4 border border-gray-300 rounded-lg dark:border-neutral-800"
                        />
                         {/* <label className="w-full text-left mb-2">Day Off Remaining</label>
                        <input
                            value={dayOffRemaining}
                            onChange={(e) => setDayOffRemaining(e.target.value)}
                            type="number"
                            placeholder="Day Off Remaining"
                            className="w-full p-4 mb-4 border border-gray-300 rounded-lg dark:border-neutral-800"
                        />
                        <label className="w-full text-left mb-2">First Day of Work</label>
                        <input
                            value={firstDayOfWork}
                            onChange={(e) => setFirstDayOfWork(e.target.value)}
                            type="date"
                            placeholder="First Day of Work"
                            className="w-full p-4 mb-4 border border-gray-300 rounded-lg dark:border-neutral-800"
                        /> */}
                        <button
                            type="submit"
                            className="w-full p-4 mb-4 text-white bg-gradient-to-r from-sky-500 to-blue-500 rounded-lg"
                        >
                            Sign Up
                        </button>
                        <p className="text-sm opacity-50">
                            Already have an account?{" "}
                            <Link href="/auth/login" passHref className="text-blue-500 hover:text-blue-700">
                                Login
                            </Link>
                        </p>
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
        </>
    );
}
