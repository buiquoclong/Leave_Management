import { Layout } from "@/components/account";
import { useEffect, useState } from "react";
import { Nav } from "@/components/Nav.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import Link from 'next/link';

export default function LeaveList() {
    const [leaveList, setLeaveList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [userInfo, setUserInfo] = useState({});
    const [dayremain, setDayremain]= useState();
    let userId = 0;
    if (typeof window !== 'undefined') {

        userId = sessionStorage.getItem('userId');
    }
    useEffect(() => {
        fetch(`http://localhost:8081/api/employees/${userId}`).then((response) => response.json()).then((data) => {
            setUserInfo(data);
            console.log(data);
        }).catch((error) => console.error("Error fetching data:", error));
    }, []);

    useEffect(() => {
        fetch(`http://localhost:8081/api/leave-applications/get-by-employee-id/${userId}`)
            .then((response) => {
                console.log(response);
                return response.json()
            })
            .then((data) => {
                console.log(data + "data");
                setLeaveList(data);
                console.log(" leaveList after set" + leaveList);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);
    const formatDate = (date) => {
        const d = new Date(date);
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = leaveList.slice(indexOfFirstItem, indexOfLastItem);
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(leaveList.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }
    // man hinh chi tiet don xin nghi
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const openPopup = (idLeave) => {
        console.log("idLeave" + idLeave);
        setIsPopupOpen(true);
        getDetailByItineraryId(idLeave);
    }
    const closePopup = () => setIsPopupOpen(false);
    const [fullName, setFullName] = useState('');
    const [position, setPosition] = useState('');
    const [dateStart, setDateStart] = useState('');
    const [dateEnd, setDateEnd] = useState('');
    const [reason, setReason] = useState('');
    const [reasonBoss, setReasonBoss] = useState('');
    const [status, setStatus] = useState();
    const [idLeave, setIdLeave]= useState();
    let [itinerarieData,setItinerarieData ]=useState({});

    //  hien thi danh sach
    useEffect(() => {
        getDetailByItineraryId(userId); // id form xin nghi 

    }, [userId]);
    const getDetailByItineraryId = async (idLeave) => {
        try {
            const response = await fetch(`http://localhost:8081/api/leave-applications/${idLeave}`);
            if (response.ok) {
                itinerarieData = await response.json();
                console.log("hfhhf"+itinerarieData);
                setFullName(itinerarieData.employee.username); // Assign the value to name state variables
                setPosition(itinerarieData.employee.position); // Assign the value to content state variable
                setDayremain(itinerarieData.employee.dayOffRemaining);
                setDateStart(itinerarieData.from); // Assign the value to dateStart state variable
                setDateEnd(itinerarieData.to); // Assign the value to dateEnd state variable
                setReason(itinerarieData.reason);
                setReasonBoss(itinerarieData.reasonReject);
                setStatus(itenerarieData.status);
            } else {
                console.log('Failed to fetch itinerary data');
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };

    return (
        <Layout>
            <Nav />
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
                                    <th className='py-2 px-4'>From</th>
                                    <th className='py-2 px-4'>To</th>
                                    <th className='py-2 px-4'>Status</th>
                                    <th className='py-2 px-4'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((leave, index) => (
                                    <tr key={index} className="border-t">
                                        <td className="py-2 px-4">{leave.id}</td>
                                        <td className="py-2 px-4">{leave.from}</td>
                                        <td className="py-2 px-4">{leave.to}</td>
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
                                                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </div>
                                            {isPopupOpen && (
                                                <div className="fixed inset-0 bg-gray-700 bg-opacity-75 flex justify-center items-center z-50">
                                                    <div className="p-6 bg-white rounded-lg w-full max-w-lg mx-4 sm:mx-0">
                                                        <div className="flex justify-end">
                                                            <button onClick={closePopup} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                        <h2 className="text-center text-2xl sm:text-3xl font-semibold mb-6">Chi tiết đơn nghỉ phép</h2>
                                                        <form>
                                                            <div className="mb-4 flex items-center">
                                                                <label htmlFor="fullName" className="block text-gray-700 w-1/3">Họ tên:</label>
                                                                <input
                                                                    type="text"
                                                                    id="fullName"
                                                                    name="fullName"
                                                                    value={fullName}
                                                                    className="mt-1 block w-2/3 border border-gray-300 rounded-md bg-gray-200 px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                                    readOnly
                                                                />
                                                            </div>
                                                            <div className="mb-4 flex items-center">
                                                                <label htmlFor="department" className="block text-gray-700 w-1/3">Chức vụ:</label>
                                                                <input
                                                                    type="text"
                                                                    id="role"
                                                                    name="role"
                                                                    value={position}
                                                                    className="mt-1 block w-2/3 border border-gray-300 rounded-md bg-gray-200 px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                                    readOnly
                                                                />
                                                            </div>
                                                            <div className="mb-4 flex items-center">
                                                                <label htmlFor="leaveDates" className="block text-gray-700 w-1/3">Ngày bắt đầu:</label>
                                                                <input
                                                                    type="date"
                                                                    value={dateStart}
                                                                    className="mt-1 block w-2/3 border border-gray-300 rounded-md bg-gray-200 px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                                    readOnly
                                                                />
                                                            </div>
                                                            <div className="mb-4 flex items-center">
                                                                <label htmlFor="leaveDates" className="block text-gray-700 w-1/3">Ngày kết thúc:</label>
                                                                <input
                                                                    type="date"
                                                                    value={dateEnd}
                                                                    className="mt-1 block w-2/3 border border-gray-300 rounded-md bg-gray-200 px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                                    readOnly
                                                                />
                                                            </div>
                                                            <div className="mb-4 flex items-center">
                                                                <label htmlFor="reason" className="block text-gray-700 w-1/3">Lý do xin nghỉ:</label>
                                                                <textarea
                                                                    id="reason"
                                                                    name="reason"
                                                                    rows="4"
                                                                    value={reason}
                                                                    className="mt-1 block w-2/3 border border-gray-300 rounded-md bg-gray-200 px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                                    maxLength={100}
                                                                    readOnly
                                                                ></textarea>
                                                            </div>
                                                            <div className="mb-4 flex items-center">
                                                                <label htmlFor="message" className="block text-gray-700 w-1/3">Lý do từ chối đơn nghỉ (boss):</label>
                                                                <textarea
                                                                    id="message"
                                                                    name="message"
                                                                    rows="4"
                                                                    className="mt-1 block w-2/3 border border-gray-300 rounded-md bg-gray-200 px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                                    maxLength={100}
                                                                    value={reasonBoss}
                                                                ></textarea>
                                                            </div>
                                                            {/* <div className="flex justify-center gap-4">
                                                                <button type="button" onClick={handleReject} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                                                    Từ chối
                                                                </button>
                                                                <button type="button" onClick={handleApprove} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                                                    Chấp nhận
                                                                </button>
                                                            </div> */}
                                                        </form>
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
        </Layout>

    )
        ;
}

// {isPopupOpen && (
//     <div className="modal-bg fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
//         <div className="modal p-4 bg-white rounded-lg w-[500px]">
//             <div className="flex justify-end">
//                 <button onClick={closePopup} className="text-gray-500 hover:text-gray-700 focus:outline-none">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                 </button>
//             </div>
//             <h2 className="text-center text-4xl font-semibold "> Chi tiết đơn nghỉ phép </h2>
//             <form >
//                 <div className="form-group flex justify-between m-4">
//                     <label htmlFor="fullName" className="my-auto">
//                         Họ tên:
//                     </label>
//                     <input
//                         type="text"
//                         id="fullName"
//                         name="fullName"
//                         value={fullName}
//                         className="border-1 outline-none bg-gray-300 pl-2 h-10 rounded-lg w-64 pr-2"
//                         readOnly
//                     />
//                 </div>

//                 <div className="form-group flex justify-between m-4">
//                     <label htmlFor="department" className="my-auto">
//                         Chức vụ:
//                     </label>
//                     <input
//                         type="text"
//                         id="role"
//                         name="role"
//                         value={position}
//                         className="border-1 outline-none bg-gray-300 pl-2 h-10 rounded-lg w-64 pr-2"
//                         readOnly
//                     />
//                 </div>
//                 <div className="form-group flex justify-between m-4">
//                     <label htmlFor="leaveDates" className="my-auto">
//                         Ngày bắt đầu: </label>

//                     <input
//                         type="date"

//                         style={{ outline: "none" }}
//                         value={dateStart}
//                         className="border-1 outline-none bg-gray-300 pl-2 h-10 rounded-lg w-64 pr-2"
//                         readOnly

//                     />

//                 </div>
//                 <div className="form-group flex justify-between m-4">
//                     <label htmlFor="leaveDates" className="my-auto">Ngày kết thúc: </label>

//                     <input
//                         type="date"
//                         value={dateEnd}
//                         className="border-1 outline-none bg-gray-300 pl-2 h-10 rounded-lg w-64 pr-2"
//                         readOnly
//                     />

//                 </div>
//                 <div className="form-group flex justify-between m-4">
//                     <label htmlFor="reason" className="my-auto">
//                         Lý do xin nghỉ:
//                     </label>
//                     <textarea
//                         id="reason"
//                         name="reason"
//                         rows="4"
//                         value={reason} // Giá trị cụ thể
//                         className="border-1 outline-none bg-gray-300 pl-2 pt-2 h-16 rounded-lg w-64 pr-2"
//                         maxLength={100}
//                         readOnly // Để trường này chỉ hiển thị dữ liệu, không cho phép sửa
//                     ></textarea>
//                 </div>
//                 <div className="form-group flex justify-between m-4">
//                     <label htmlFor="message" className="my-auto">
//                         Lý do từ chối đơn nghỉ (boss)
//                     </label>
//                     <textarea
//                         id="message"
//                         name="message"
//                         rows="4"
//                         className="border-1 outline-none bg-gray-300 pl-2 pt-2 h-16 rounded-lg w-64 pr-2"
//                         maxLength={100}
//                         value={reasonBoss}
//                         // onChange={handleBossAction}
//                     ></textarea>
//                 </div>
//                 {/* <div className="form-buttons flex justify-center gap-4">


//                     <button type="button" onClick={handleReject} className="btn bg-red-500 px-4 py-2 rounded-lg text-white">
//                         Từ chối
//                     </button>
//                     <button type="button" onClick={handleApprove} className="btn bg-blue-500 px-4 py-2 rounded-lg text-white">
//                         Chấp nhận
//                     </button>
//                 </div> */}
//             </form>
//         </div>
//     </div>
// )}