 import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6 sm:p-12">
            <h1 className="text-4xl mb-8 p-3 font-bold text-center text-gray-800">Welcome to Employee Leave Management</h1>
            <div className="w-full max-w-lg mx-auto mb-12">
                <Image
                    src="/leave_emp.png"
                    alt="leave_emp"
                    width={700}
                    height={600}
                    className="rounded-lg shadow-lg"
                />
            </div>
            <Link href="/auth/login">
                <button className="flex items-center justify-center w-full max-w-xs px-8 py-4 mt-8 text-lg font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 ease-in-out">
                    {/* <FontAwesomeIcon icon={faArrowRightToBracket} className="mr-2" /> */}
                    Login to Continue
                </button>
            </Link>
        </main>
    );
}
