import { Layout } from "@/components/account";
import { useEffect, useState } from "react";
import { Nav } from "@/components/Nav.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    username: "",
    password: "",
    email: "",
    fullName: "",
    bossId: 0,
    position: ""
  });
  let userId = 0;
    if (typeof window !== 'undefined') {

        userId = sessionStorage.getItem('userId');
    }
  useEffect(() => {
    if (userId) {
      setNewEmployee(prevState => ({
        ...prevState,
        bossId: Number(userId)
      }));
    }

    const fetchEmployees = async () => {
        setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:8081/api/employees/get-by-boss-id/${userId}`);
        const data = await response.json();
        setEmployees(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching employees:', error);
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, [userId]);

  const deleteEmployee = async (id) => {
    setIsLoading(true);
    try {
      await fetch(`http://localhost:8081/api/employees/${id}`, {
        method: 'DELETE',
      });
      setIsLoading(false);
      toast.success('Employee deleted successfully');
      setEmployees(employees.filter(employee => employee.id !== id));
    } catch (error) {
      setIsLoading(false);
      console.error('Error deleting employee:', error);
      toast.error('Failed to delete employee');
    }
  };
  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await fetch("http://localhost:8081/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEmployee),
      });
      setIsLoading(false);
      toast.success("Employee added successfully");
      setNewEmployee({
        username: "",
        password: "",
        email: "",
        fullName: "",
        bossId: 0,
        position: "",
      });
      setShowModal(false);
      // Fetch employees again to update the list
      const response = await fetch(`http://localhost:8081/api/employees/get-by-boss-id/${userId}`);
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
        setIsLoading(false);
      console.error("Error adding employee:", error);
      toast.error("Failed to add employee", { containerId: "employeeList" });
    }
  };

  // Get current employees
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Layout>
      <Nav />
      {isLoading && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-75 flex justify-center items-center z-50">
          <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      )}
      <div className="employeeList">
      <div className="flex bg-blue-50 p-4">
        <h1 className="text-3xl font-semibold text-center w-full">Danh sách nhân viên</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          <FontAwesomeIcon icon={faPlus} /> Thêm nhân viên
        </button>
      </div>
      <div className="flex my-10 h-screen bg-blue-50 dark:bg-zinc-800">
        <div className="container mx-auto">
          <div className="overflow-x-auto border rounded-lg shadow-lg">
            <table className="table-auto w-full text-center">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4">Full Name</th>
                  <th className="py-2 px-4">Username</th>
                  <th className="py-2 px-4">Email</th>
                  <th className="py-2 px-4">Position</th>
                  <th className="py-2 px-4">First Day of Work</th>
                  <th className="py-2 px-4">Day Off Remaining</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentEmployees.map((employee, index) => (
                  <tr key={index} className="border-t hover:bg-gray-100">
                    <td className="py-2 px-4">{employee.fullName}</td>
                    <td className="py-2 px-4">{employee.username}</td>
                    <td className="py-2 px-4">{employee.email}</td>
                    <td className="py-2 px-4">{employee.position}</td>
                    <td className="py-2 px-4">
                      {new Date(employee.firstDayOfWork).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4">{employee.dayOffRemaining}</td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => deleteEmployee(employee.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              employeesPerPage={employeesPerPage}
              totalEmployees={employees.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>
      <ToastContainer
        containerId="employeeList"
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Zoom}
      />

{showModal && (
  <div className="fixed inset-0 bg-gray-700 bg-opacity-75 flex justify-center items-center z-50">
    <div className="popup rounded-lg">
      <div className="popup-inner p-6 rounded-lg bg-blue-50 shadow-lg max-w-md mx-auto">
        <form onSubmit={handleAddEmployee}>
          <h2 className="text-center text-2xl font-semibold text-gray-800 mb-4">Thêm nhân viên</h2>
          <div className="form-group mb-4">
            <label htmlFor="username" className="block text-gray-700 font-medium mb-1">Tên đăng nhập:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={newEmployee.username}
              onChange={(e) => setNewEmployee({ ...newEmployee, username: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="form-group mb-4">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-1">Mật khẩu:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={newEmployee.password}
              onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="form-group mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={newEmployee.email}
              onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="form-group mb-4">
            <label htmlFor="fullName" className="block text-gray-700 font-medium mb-1">Họ tên:</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={newEmployee.fullName}
              onChange={(e) => setNewEmployee({ ...newEmployee, fullName: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="form-group mb-4">
            <label htmlFor="position" className="block text-gray-700 font-medium mb-1">Chức vụ:</label>
            <input
              type="text"
              id="position"
              name="position"
              value={newEmployee.position}
              onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="form-buttons flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Thêm
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}

    </div>
    </Layout>
  );
};

const Pagination = ({ employeesPerPage, totalEmployees, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalEmployees / employeesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="flex justify-center my-4">
      <ul className="flex list-none">
        {pageNumbers.map(number => (
          <li key={number} className={`mx-1 ${currentPage === number ? 'font-bold' : ''}`}>
            <a 
              onClick={() => paginate(number)} 
              href="#" 
              className="py-2 px-4 border rounded hover:bg-gray-200"
            >
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Employees;
