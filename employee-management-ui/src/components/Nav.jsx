import {useEffect, useState} from "react";
import "./assets/formStyle.css";
import Datepicker from "react-tailwindcss-datepicker";
import Link from 'next/link';
import { useRouter } from 'next/router';

export {Nav};

function Nav() {
    const [currentPage, setcurrentPage] = useState('leaveList');
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const router = useRouter();
    const openPopup = () => setIsPopupOpen(true);
    const closePopup = () => setIsPopupOpen(false);
    const [formData, setFormData] = useState({
        fullName: "",
        role: "",
    });

    useEffect(() => {
        const fetchEmployeeData = async () => {
            try {
                // Lấy ID từ localStorage
                // const storedId = localStorage.getItem('employeeId');
                // if (!storedId) {
                //     throw new Error('Employee ID not found in localStorage');
                // }
                const storedId = sessionStorage.getItem('userId');
                if (!storedId) {
                    throw new Error('Employee ID not found in localStorage');
                }


                // Gọi API với ID từ localStorage
                const response = await fetch(`http://localhost:8081/api/employees/${storedId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch employee data');
                }

                const data = await response.json();
                console.log(data); // Kiểm tra dữ liệu được trả về từ API

                // Set data to form fields
                setFormData({
                    fullName: data.fullName,
                    role: data.position,
                });
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchEmployeeData();
    }, []);

    // Nhấn gửi đơn
    const handleSubmit =  (event) => {
        event.preventDefault();

        const storedId = sessionStorage.getItem('userId');
        if (!storedId) {
            throw new Error('Employee ID not found in localStorage');
        }

        if (!startDate || !endDate) {
            // Hiển thị cảnh báo nếu ngày không được chọn
            alert("Vui lòng chọn ngày nghỉ trước khi gửi!");
            return;
        } else {
            const requestData = {
                reason: event.target.reason.value,
                from: startDate,
                to: endDate

            };
            // Gửi dữ liệu
            fetch(`http://localhost:8081/api/leave-applications/save?employeeId=${storedId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            })
                .then(response => {
                    if (response.ok) {
                        console.log('Dữ liệu đã được gửi thành công!');

                        closePopup();
                        alert("Bạn đã gửi đơn đăng ký thành công")
                        setStartDate("")
                        setEndDate("")
                        // Thực hiện các hành động khác (ví dụ: hiển thị thông báo)
                    } else {
                        console.error('Đã xảy ra lỗi khi gửi dữ liệu.');
                        // Xử lý lỗi nếu cần
                    }
                })
                .catch(error => console.error('Lỗi:', error));



        }
    };

    const [startDate, setStartDate] = useState('');
    const handleStartDateChange = (event) => {
        const selectedDate = event.target.value;
        const today = new Date();
        const selected = new Date(selectedDate);

        if (selected < today) {
            alert('Bạn không thể chọn ngày đã kết thúc.');
        } else {
            setStartDate(selectedDate);
        }
    };
    const [endDate, setEndDate] = useState('');
    const handleEndDateChange = (event) => {
        const selectedDate = event.target.value;
        const today = new Date();
        const selected = new Date(selectedDate);

        if (selected < today) {
            alert('Bạn không thể chọn ngày đã kết thúc.');
        } else if (selected < new Date(startDate)) {
            alert('Ngày kết thúc phải sau ngày bắt đầu.');
        } else {
            setEndDate(selectedDate);
        }
    };


    const closePopupWithConfirmation = () => {
        const isConfirmed = window.confirm("Bạn có chắc chắn muốn đóng không?");
        if (isConfirmed) {
            closePopup();
        }
    };
    return (
        // <nav className="flex items-center justify-between flex-wrap bg-teal-500 p-6">
        //     <div className="flex items-center flex-shrink-0 text-white mr-6">
        //         <span className="font-semibold text-xl tracking-tight">Employee Leave Management</span>
        //     </div>
        //     <div className="block lg:hidden">
        //         <button
        //             id="nav"
        //             className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white"
        //         >
        //             <svg
        //                 className="fill-current h-3 w-3"
        //                 viewBox="0 0 20 20"
        //                 xmlns="http://www.w3.org/2000/svg"
        //             >
        //                 <title>Menu</title>
        //                 <path
        //                     fillRule="evenodd"
        //                     clipRule="evenodd"
        //                     d="M2 5h16v1H2V5zm0 5h16v1H2v-1zm16 4H2v1h16v-1z"
        //                 />
        //             </svg>
        //         </button>
        //     </div>
        //     <div
        //         id="nav-content"
        //         className="w-full block flex-grow lg:flex lg:items-center lg:w-auto"
        //     >
        //         <div className="text-sm lg:flex-grow justify-between">
        //             <a
        //                 href="/"
        //                 className={`block mt-4 lg:inline-block lg:mt-0 ${currentPage === 'home' ? 'text-white' : 'text-teal-200'} hover:text-white font-semibold  mr-4`}
        //                 onClick={() => setcurrentPage("home")}
        //             >
        //                 Home
        //             </a>
        //             <a
        //                 href="/account/leaveList"
        //                 className={`block mt-4 lg:inline-block lg:mt-0 ${currentPage === 'leaveList' ? 'text-white' : 'text-teal-200'} hover:text-white font-semibold mr-4`}
        //                 onClick={() => setcurrentPage("leaveList")}
        //             >
        //                 Leave List
        //             </a>
        //             <a
        //                 href="/account/requestList"
        //                 className={`block mt-4 lg:inline-block lg:mt-0 ${currentPage === 'requestList' ? 'text-white' : 'text-teal-200'} hover:text-white font-semibold mr-4`}
        //                 onClick={() => setcurrentPage("requestList")}
        //             >
        //                 Leave Request
        //             </a>
        //         </div>
        //         <div>
        //             <button
        //                 className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0"
        //                 onClick={openPopup}
        //             >
        //                 Register Leave
        //             </button>
        //         </div>
                
        //     </div>
        // </nav>
        <nav className="flex items-center justify-between flex-wrap bg-teal-500 p-6">
    <div className="flex items-center flex-shrink-0 text-white mr-6">
        <span className="font-semibold text-xl tracking-tight">Employee Leave Management</span>
    </div>
    <div className="block lg:hidden">
        <button
            id="nav"
            className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white"
            onClick={() => document.getElementById('nav-content').classList.toggle('hidden')}
        >
            <svg
                className="fill-current h-3 w-3"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
            >
                <title>Menu</title>
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M2 5h16v1H2V5zm0 5h16v1H2v-1zm16 4H2v1h16v-1z"
                />
            </svg>
        </button>
    </div>
    <div
        id="nav-content"
        className="w-full block flex-grow lg:flex lg:items-center lg:w-auto hidden lg:block"
    >
        <div className="text-sm lg:flex-grow">
            <Link href="/" passHref className={`block mt-4 lg:inline-block lg:mt-0 ${router.pathname === '/' ? 'text-white' : 'text-teal-200'} hover:text-white font-semibold mr-4`}>
                    Home
            </Link>
            <Link href="/account/leaveList" passHref className={`block mt-4 lg:inline-block lg:mt-0 ${router.pathname === '/account/leaveList' ? 'text-white' : 'text-teal-200'} hover:text-white font-semibold mr-4`}>
                    Leave List
            </Link>
            <Link href="/account/requestList" passHref className={`block mt-4 lg:inline-block lg:mt-0 ${router.pathname === '/account/requestList' ? 'text-white' : 'text-teal-200'} hover:text-white font-semibold mr-4`}>
                    Leave Request
            </Link>
        </div>
        <div>
            <button
                className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0"
                onClick={openPopup}
            >
                Register Leave
            </button>
        </div>
        {isPopupOpen && (
            <div className="fixed inset-0 bg-gray-700 bg-opacity-75 flex justify-center items-center z-50">
                <div className="popup rounded-lg ">
                    <div className="popup-inner p-6 rounded-lg bg-blue-50 shadow-lg max-w-md mx-auto">
                        <form onSubmit={handleSubmit}>
                            <h2 className="text-center text-2xl font-semibold text-gray-800 mb-4">Đơn xin nghỉ phép</h2>
                            <div className="form-group mb-4">
                                <label htmlFor="fullName" className="block text-gray-700 font-medium mb-1">Họ tên:</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="form-group mb-4">
                                <label htmlFor="role" className="block text-gray-700 font-medium mb-1">Chức vụ:</label>
                                <input
                                    type="text"
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="form-group mb-4">
                                <label htmlFor="startDate" className="block text-gray-700 font-medium mb-1">Ngày bắt đầu:</label>
                                <input
                                    type="date"
                                    id="startDate"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={startDate}
                                    onChange={handleStartDateChange}
                                />
                            </div>
                            <div className="form-group mb-4">
                                <label htmlFor="endDate" className="block text-gray-700 font-medium mb-1">Ngày kết thúc:</label>
                                <input
                                    type="date"
                                    id="endDate"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={endDate}
                                    onChange={handleEndDateChange}
                                />
                            </div>
                            <div className="form-group mb-4">
                                <label htmlFor="reason" className="block text-gray-700 font-medium mb-1">Lý do xin nghỉ:</label>
                                <textarea
                                    id="reason"
                                    name="reason"
                                    rows="4"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    maxLength={100}
                                ></textarea>
                            </div>
                            <div className="form-buttons flex justify-end gap-3">
                                <button type="button" onClick={closePopupWithConfirmation}
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg">Hủy
                                </button>
                                <button type="submit"
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">Gửi
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        )}
    </div>
</nav>

    )
}

