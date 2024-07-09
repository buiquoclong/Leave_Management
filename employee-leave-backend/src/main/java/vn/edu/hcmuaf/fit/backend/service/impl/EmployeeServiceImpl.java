package vn.edu.hcmuaf.fit.backend.service.impl;

import org.springframework.stereotype.Service;
import vn.edu.hcmuaf.fit.backend.dto.EmployeeDTO;
import vn.edu.hcmuaf.fit.backend.exception.ResourceNotFoundException;
import vn.edu.hcmuaf.fit.backend.model.Employee;
import vn.edu.hcmuaf.fit.backend.repository.EmployeeRepository;
import vn.edu.hcmuaf.fit.backend.service.EmployeeService;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EmployeeServiceImpl implements EmployeeService {
    private EmployeeRepository employeeRepository;

    public EmployeeServiceImpl(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Override
    public Employee saveEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    @Override
    public List<Employee> getAllEmployee() {
        return employeeRepository.findAll();
    }

    @Override
    public Employee getEmployeeByID(int id) {
        return employeeRepository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Employee", "Id", id));
    }

    @Override
    public Employee updateEmployeeByID(EmployeeDTO employeeDTO, int id) {
        Employee existingEmployee = employeeRepository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Employee", "Id", id));

        existingEmployee.setFullName(employeeDTO.getFullName());
        existingEmployee.setEmail(employeeDTO.getEmail());
        existingEmployee.setUsername(employeeDTO.getUsername());
        existingEmployee.setUpdatedAt(LocalDateTime.now());

        return employeeRepository.save(existingEmployee);
    }

    @Override
    public void deleteEmployeeByID(int id) {
        employeeRepository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Employee", "Id", id));

        employeeRepository.deleteById(id);
    }

    @Override
    public String login(String username, String pass) {
       Employee e = employeeRepository.findByUsernameAndPassword(username,pass);
//        System.out.println(e.getUsername());
       if (e!=null) return e.getId()+"";
        return "user khong dung";
    }
}
