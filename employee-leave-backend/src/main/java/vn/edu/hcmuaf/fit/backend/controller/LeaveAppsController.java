package vn.edu.hcmuaf.fit.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.hcmuaf.fit.backend.dto.LeaveApplicationsDTO;
import vn.edu.hcmuaf.fit.backend.model.Employee;
import vn.edu.hcmuaf.fit.backend.model.LeaveApplications;
import vn.edu.hcmuaf.fit.backend.service.EmployeeService;
import vn.edu.hcmuaf.fit.backend.service.LeaveAppsService;

import java.util.List;

import static vn.edu.hcmuaf.fit.backend.Util.Email.sendMailWithoutTemplate;


@RestController
@RequestMapping("api/leave-applications")
@CrossOrigin("http://localhost:3000")
public class LeaveAppsController {
    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private LeaveAppsService leaveAppsService;

    public LeaveAppsController(LeaveAppsService leaveAppsService) {
        this.leaveAppsService = leaveAppsService;
    }

    // Create a new Leave Application
    @PostMapping("/save")
    public ResponseEntity<LeaveApplications> createLeaveApps(@RequestParam int employeeId,
                                                             @RequestBody LeaveApplicationsDTO leaveApps) throws Exception {
        Employee employee = employeeService.getEmployeeByID(employeeId);
        Employee boss = employeeService.getEmployeeByID(employee.getBossId().getId());

        sendMailWithoutTemplate(boss.getEmail(), "Bạn có một số đơn xin nghỉ phép cần xử lý", "Thông báo xử lý đơn xin nghỉ phép");

        return new ResponseEntity<>(leaveAppsService.saveLeaveApps(employeeId, leaveApps), HttpStatus.CREATED);
    }

    @GetMapping("{id}")
    public ResponseEntity<LeaveApplications> getEmployeeById(@PathVariable("id") int id) {
        return new ResponseEntity<>(leaveAppsService.getLeaveAppsByID(id), HttpStatus.OK);
    }

    // Approve Leave Application
    @PutMapping("/approve/{id}")
    public ResponseEntity<LeaveApplications> approveLeaveApps(@PathVariable("id") int id,
                                                              @RequestBody LeaveApplicationsDTO leaveAppsDTO) throws Exception {
        return ResponseEntity.ok(leaveAppsService.approveLeaveAppsByID(id, leaveAppsDTO));
    }

    @GetMapping("/get-by-employee-id/{employeeId}")
    public List<LeaveApplications> getLeaveAppsByEmployeeId(@PathVariable("employeeId") int employeeId) {
        return leaveAppsService.getLeaveAppsByEmployeeId(employeeId);
    }

    @GetMapping("/get-by-handle-by/{handleBy}")
    public List<LeaveApplications> getLeaveAppsByHandleBy(@PathVariable("handleBy") int handleBy) {
        return leaveAppsService.getLeaveAppsByHandleById(handleBy);
    }
}
