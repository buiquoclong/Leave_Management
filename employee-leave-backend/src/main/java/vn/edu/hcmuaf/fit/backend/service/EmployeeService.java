package vn.edu.hcmuaf.fit.backend.service;

import vn.edu.hcmuaf.fit.backend.model.Employee;

import java.util.List;


public interface EmployeeService {
    Employee saveEmployee(Employee employee);
    List<Employee> getAllEmployee();
    Employee getEmployeeByID(int id);
    Employee updateEmployeeByID(Employee employee, int id);
    void deleteEmployeeByID(int id);
    String login(String username, String pass);
}
