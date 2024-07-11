package vn.edu.hcmuaf.fit.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.hcmuaf.fit.backend.dto.EmployeeDTO;
import vn.edu.hcmuaf.fit.backend.dto.PasswordDTO;
import vn.edu.hcmuaf.fit.backend.dto.PasswordResetDTO;
import vn.edu.hcmuaf.fit.backend.model.Employee;
import vn.edu.hcmuaf.fit.backend.service.EmployeeService;

import java.util.List;

// Url: http://localhost:8081/api/employees

@RestController
@RequestMapping("api/employees")
@CrossOrigin("http://localhost:3000")
public class EmployeeController {
    private EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    // Create a new Employee
    @PostMapping()
    public ResponseEntity<Employee> createEmployee(@RequestBody Employee employee) {
        return new ResponseEntity<>(employeeService.saveEmployee(employee), HttpStatus.CREATED);
    }

    // Get all Employee
    @GetMapping
    public List<Employee> getAllEmployees() {
        return employeeService.getAllEmployee();
    }

    // Get Employee by id
    @GetMapping("{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable("id") int id) {
        return new ResponseEntity<>(employeeService.getEmployeeByID(id), HttpStatus.OK);
    }

    // Update Employee by id
    @PutMapping("{id}")
    public ResponseEntity<Employee> updateEmployeeById(@PathVariable("id") int id,
                                                       @RequestBody EmployeeDTO employee) {
        return new ResponseEntity<>(employeeService.updateEmployeeByID(employee, id), HttpStatus.OK);
    }

    // Update Employee by id
    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteEmployeeById(@PathVariable("id") int id) {
        employeeService.deleteEmployeeByID(id);
        return new ResponseEntity<>("Employee " + id + " is deleted successfully!", HttpStatus.OK);
    }

    @GetMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam String email) {
        try {
            return new ResponseEntity<>(employeeService.forgotPassword(email), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody PasswordResetDTO passwordResetDTO) {
        try {
            return new ResponseEntity<>(employeeService.resetPassword(passwordResetDTO.getToken(), passwordResetDTO.getPassword()), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/change-password/{id}")
    public ResponseEntity<String> changePassword(@PathVariable("id") int id, @RequestBody PasswordDTO passwordDTO) {
        try {
            return new ResponseEntity<>(employeeService.updatePassword(passwordDTO, id), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/get-by-boss-id/{bossId}")
    public ResponseEntity<?> getEmployeeByBossId(@PathVariable("bossId") int bossId) {
        try {
            return new ResponseEntity<>(employeeService.getEmployeeByBossId(bossId), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
