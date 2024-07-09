package vn.edu.hcmuaf.fit.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.hcmuaf.fit.backend.dto.LoginBodydto;
import vn.edu.hcmuaf.fit.backend.model.Employee;
import vn.edu.hcmuaf.fit.backend.service.EmployeeService;

@RestController
@RequestMapping("api/login")
@CrossOrigin("http://localhost:3000")
public class LoginController {
    private EmployeeService employeeService;

    public LoginController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }
    @PostMapping()
    public String login(@RequestBody LoginBodydto loginBodydto){
        return employeeService.login(loginBodydto.getUsername(),loginBodydto.getPass());
    }


}
