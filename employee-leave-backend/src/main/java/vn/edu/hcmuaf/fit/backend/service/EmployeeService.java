package vn.edu.hcmuaf.fit.backend.service;

import vn.edu.hcmuaf.fit.backend.dto.EmployeeDTO;
import vn.edu.hcmuaf.fit.backend.dto.PasswordDTO;
import vn.edu.hcmuaf.fit.backend.model.Employee;

import java.util.List;


public interface EmployeeService {
    Employee saveEmployee(Employee employee);
    List<Employee> getAllEmployee();
    Employee getEmployeeByID(int id);
    Employee updateEmployeeByID(EmployeeDTO employeeDTO, int id);
    void deleteEmployeeByID(int id);
    String login(String username, String pass);
    String forgotPassword(String email) throws Exception;
    String resetPassword(String token, String password) throws Exception;
    String updatePassword(PasswordDTO passwordDTO, int employeeId) throws Exception;
    List<Employee> getEmployeeByBossId(int bossId);
}
