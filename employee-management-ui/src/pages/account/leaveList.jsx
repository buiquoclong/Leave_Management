import { Layout } from "@/components/account";
import { useEffect, useState } from "react";
import { Nav } from "@/components/Nav.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import Link from 'next/link';
import { toast, ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LeaveList() {
    const [leaveList, setLeaveList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [userInfo, setUserInfo] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [fullName, setFullName] = useState('');
    const [position, setPosition] = useState('');
    const [dateStart, setDateStart] = useState('');
    const [dateEnd, setDateEnd] = useState('');
    const [reason, setReason] = useState('');
    const [reasonBoss, setReasonBoss] = useState('');
    const [status, setStatus] = useState();
    const [idLeave, setIdLeave] = useState();
    let userId = 0;

    if (typeof window !== 'undefined') {
        userId = sessionStorage.getItem('userId');
    }

    useEffect(() => {
        fetch(`http://localhost:8081/api/employees/${userId}`)
            .then(response => response.json())
            .then(data => setUserInfo(data))
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    useEffect(() => {
        fetch(`http://localhost:8081/api/leave-applications/get-by-employee-id/${userId}`)
            .then(response => response.json())
            .then(data => setLeaveList(data.sort((a, b) => b.id - a.id)))
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    const formatDate = (date) => {
        const d = new Date(date);
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = leaveList.slice(indexOfFirstItem, indexOfLastItem);
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(leaveList.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const openPopup = (idLeave) => {
        setIsPopupOpen(true);
        getDetailByItineraryId(idLeave);
    };

    const closePopup = () => setIsPopupOpen(false);

    const getDetailByItineraryId = async (idLeave) => {
        try {
            const response = await fetch(`http://localhost:8081/api/leave-applications/${idLeave}`);
            if (response.ok) {
                const data = await response.json();
                setFullName(data.employee.fullName);
                setPosition(data.employee.position);
                setDateStart(data.from);
                setDateEnd(data.to);
                setReason(data.reason);
                setReasonBoss(data.reasonReject);
                setStatus(data.status);
            } else {
                console.log('Failed to fetch itinerary data');
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };

    const deleteLeaveApplication = async (id) => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:8081/api/leave-applications/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setIsLoading(false);
                toast.success("Đơn xin nghỉ đã được xóa thành công!");
                setLeaveList(leaveList.filter(leave => leave.id !== id));
            } else {
                setIsLoading(false);
                const errorText = await response.text();
                toast.error(`Lỗi: ${errorText}`);
            }
        } catch (error) {
            setIsLoading(false);
            toast.error(`Lỗi: ${error.message || 'Đã có lỗi xảy ra'}`);
        }
    };

    return (
        <Layout>
            <Nav />
            {isLoading && (
                <div className="fixed inset-0 bg-gray-700 bg-opacity-75 flex justify-center items-center z-50">
                    <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-teal-500"></div>
                </div>
            )}
            <div className="leaveList">
                <div className="flex bg-blue-50 p-4">
                    <h1 className="text-3xl font-semibold text-center w-full">Danh sách đơn xin nghỉ</h1>
                </div>
                <div className="flex justify-center mt-4">
                    <span className="bg-white text-blue-500 font-semibold px-4 py-2 rounded-lg shadow-md">
                        Số ngày nghỉ còn lại: {userInfo.dayOffRemaining}
                    </span>
                </div>
                <div className="flex my-10 h-screen bg-blue-50 dark:bg-zinc-800">
                    <div className="container mx-auto">
                        <div className="overflow-x-auto border rounded-lg shadow-lg">
                            <table className="table-auto w-full text-center">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className='py-2 px-4'>ID</th>
                                        <th className='py-2 px-4'>Ngày bắt đầu</th>
                                        <th className='py-2 px-4'>Ngày kết thúc</th>
                                        <th className='py-2 px-4'>Trạng thái</th>
                                        <th className='py-2 px-4'>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((leave, index) => (
                                        <tr key={index} className="border-t">
                                            <td className="py-2 px-4">{leave.id}</td>
                                            <td className="py-2 px-4">{formatDate(leave.from)}</td>
                                            <td className="py-2 px-4">{formatDate(leave.to)}</td>
                                            <td className="py-2 px-4">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${leave.status === 1 ? 'bg-green-100 text-green-800' : leave.status === 0 ? 'bg-red-300 text-red-800' : 'bg-gray-400 text-black-800'}`}>
                                                    {leave.status === 1 ? 'Approved' : leave.status === 0 ? 'Rejected' : 'Pending'}
                                                </span>
                                            </td>
                                            <td className="py-2 px-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button onClick={() => openPopup(leave.id)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                                        <FontAwesomeIcon icon={faEye} />
                                                    </button>
                                                    <button onClick={() => deleteLeaveApplication(leave.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                </div>
                                                {isPopupOpen && (
                                                    <div className="fixed inset-0 bg-gray-700 bg-opacity-75 flex justify-center items-center z-50">
                                                        <div className="bg-white p-6 rounded-lg shadow-lg relative">
                                                            <button onClick={closePopup} className="absolute top-2 right-2 text-gray-500 hover:text-black">
                                                                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                                                                    <path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7a.996.996 0 10-1.41 1.41L10.59 12l-4.88 4.88c-.39.39-.39 1.02 0 1.41s1.02.39 1.41 0L12 13.41l4.88 4.88c.39.39 1.02.39 1.41 0s.39-1.02 0-1.41L13.41 12l4.88-4.88c.39-.39.39-1.02 0-1.41z"/>
                                                                </svg>
                                                            </button>
                                                            <h2 className="text-2xl font-semibold mb-4">Chi tiết đơn xin nghỉ</h2>
                                                            <div className="grid grid-cols-2 gap-4 ">
                                                                <div>
                                                                    <p className="text-left"><strong>Họ tên:</strong> {fullName}</p>
                                                                    <p className="text-left"><strong>Vị trí:</strong> {position}</p>
                                                                    <p className="text-left"><strong>Ngày bắt đầu:</strong> {formatDate(dateStart)}</p>
                                                                    <p className="text-left"><strong>Ngày kết thúc:</strong> {formatDate(dateEnd)}</p>
                                                                    <p className="text-left"><strong>Lý do xin nghỉ:</strong> {reason}</p>
                                                                    {status === 0 && <p className="text-left"><strong>Lý do từ chối:</strong> {reasonBoss}</p>}
                                                                </div>
                                                            </div>
                                                            <div className="mt-4">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                                                    Lý do từ chối
                                                                </label>
                                                                <textarea
                                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                    rows="4"
                                                                    value={reasonBoss}
                                                                    onChange={(e) => setReasonBoss(e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}



                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex items-center justify-center mt-4">
                            <button
                                className="px-4 py-2 mx-2 bg-gray-200 rounded hover:bg-gray-300"
                                onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage)}
                                disabled={currentPage === 1}
                            >
                                <FontAwesomeIcon icon={faArrowLeft} />
                            </button>
                            {pageNumbers.map((number) => (
                                <button
                                    key={number}
                                    className={`px-4 py-2 mx-2 ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded hover:bg-gray-300`}
                                    onClick={() => setCurrentPage(number)}
                                >
                                    {number}
                                </button>
                            ))}
                            <button
                                className="px-4 py-2 mx-2 bg-gray-200 rounded hover:bg-gray-300"
                                onClick={() => setCurrentPage(currentPage < pageNumbers.length ? currentPage + 1 : currentPage)}
                                disabled={currentPage === pageNumbers.length}
                            >
                                <FontAwesomeIcon icon={faArrowRight} />
                            </button>
                        </div>
                    </div>
                </div>
                <ToastContainer
                        containerId={leaveList}
                        position="top-right"    
                        className="toast-container"
                        toastClassName="toast"
                        bodyClassName="toast-body"
                        progressClassName="toast-progress"
                        theme='colored'
                        transition={Zoom}
                        autoClose={1000}
                        hideProgressBar={true}
                    ></ToastContainer>
            </div>
            
        </Layout>

    )
        ;
}