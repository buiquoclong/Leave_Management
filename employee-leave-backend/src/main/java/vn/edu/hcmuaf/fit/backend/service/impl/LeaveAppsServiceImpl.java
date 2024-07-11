package vn.edu.hcmuaf.fit.backend.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import vn.edu.hcmuaf.fit.backend.Util.Email;
import vn.edu.hcmuaf.fit.backend.dto.LeaveApplicationsDTO;
import vn.edu.hcmuaf.fit.backend.exception.ResourceNotFoundException;
import vn.edu.hcmuaf.fit.backend.model.Employee;
import vn.edu.hcmuaf.fit.backend.model.LeaveApplications;
import vn.edu.hcmuaf.fit.backend.repository.EmployeeRepository;
import vn.edu.hcmuaf.fit.backend.repository.LeaveAppsRepository;
import vn.edu.hcmuaf.fit.backend.service.LeaveAppsService;

import java.time.LocalDateTime;
import java.time.Period;
import java.util.List;
import java.util.Map;

@Service
public class LeaveAppsServiceImpl implements LeaveAppsService {
    private LeaveAppsRepository leaveAppsRepository;
    private EmployeeRepository employeeRepository;
    @Autowired
    private Email email;

    @Autowired
    private EmployeeServiceImpl employeeService;

    public LeaveAppsServiceImpl(LeaveAppsRepository leaveAppsRepository, EmployeeRepository employeeRepository) {
        this.leaveAppsRepository = leaveAppsRepository;
        this.employeeRepository = employeeRepository;
    }

    // Create a new leave application
    @Override
    public LeaveApplications saveLeaveApps(int employeeId, LeaveApplicationsDTO leaveAppsDTO) throws Exception {
        Employee employee = employeeRepository.findById(employeeId).orElseThrow(() ->
                new ResourceNotFoundException("Employee", "Id", leaveAppsDTO.getId()));

        LeaveApplications leaveApplications = new LeaveApplications();
        leaveApplications.setId(leaveAppsDTO.getId());
        leaveApplications.setEmployee(employee);
        leaveApplications.setReason(leaveAppsDTO.getReason());
        leaveApplications.setFrom(leaveAppsDTO.getFrom());
        leaveApplications.setTo(leaveAppsDTO.getTo());
        if (employee.getBossId() != null) {
            leaveApplications.setHandleBy(employee.getBossId());
        } else {
            throw new Exception("Nhân viên hiện tại chưa có người quản lý trên hệ thống vì thế không thể tạo đơn xin nghỉ phép. Vui lòng thử lại sau");
        }
        leaveApplications.setHandleBy(employee.getBossId());
        leaveApplications.setStatus(2);
        leaveApplications.setCreatedAt(LocalDateTime.now());

        return leaveAppsRepository.save(leaveApplications);
    }

    @Override
    public List<LeaveApplications> getAllLeaveApp() {
        return leaveAppsRepository.findAll();
    }

    @Override
    public LeaveApplications getLeaveAppsByID(int id) {
        return leaveAppsRepository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("leaveApp", "Id", id));
    }

    @Override
    public List<LeaveApplications> getLeaveAppsByEmployeeId(int employeeId) {
        return leaveAppsRepository.findByEmployeeId(employeeId);
    }

    @Override
    public List<LeaveApplications> getLeaveAppsByHandleById(int handleBy) {
        return leaveAppsRepository.findByHandleById(handleBy, Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    // Approve leave application from boss
    @Override
    public LeaveApplications approveLeaveAppsByID(int id, LeaveApplicationsDTO leaveApps) throws Exception {
        LeaveApplications existingLeaveApp = leaveAppsRepository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Leave Application", "Id", id));

        existingLeaveApp.setReasonReject(leaveApps.getReasonReject());
        existingLeaveApp.setStatus(leaveApps.getStatus());
//        existingLeaveApp.setHandleBy();
        LeaveApplications leaveApplications = getLeaveAppsByID(id);
        Employee employee = employeeService.getEmployeeByID(leaveApplications.getEmployee().getId());
        if (leaveApps.getStatus() == 1) {
            Period period = Period.between(leaveApplications.getFrom(), leaveApplications.getTo());
            int days = period.getDays();
            if (days > employee.getDayOffRemaining()) {
                leaveApps.setStatus(0);
                return leaveAppsRepository.save(existingLeaveApp);
            }
            employee.setDayOffRemaining(employee.getDayOffRemaining() - days);
            employeeRepository.save(employee);
        }
        existingLeaveApp.setUpdatedAt(LocalDateTime.now());

//        send mail
        Employee sender = employeeService.getEmployeeByID(existingLeaveApp.getEmployee().getId());
        Employee receiver = employeeService.getEmployeeByID(existingLeaveApp.getHandleBy().getId());
        String status = "";

        switch (leaveApps.getStatus()) {
            case 0:
                status = "Không chấp nhận";
                break;
            case 1:
                status = "Chấp nhận";
                break;
            default:
                status = "Đang chờ được xét duyệt";
                break;
        }
        String reason = "";
        if (leaveApps.getReasonReject().isEmpty()) {
            reason = "Không có.";
        }
        reason = leaveApps.getReasonReject();
        Map<String, String> values = Map.of(
                "leaveID", String.valueOf(existingLeaveApp.getId()),
                "sender", sender.getFullName(),
                "receiver", receiver.getFullName(),
                "status", status,
                "reason", reason);
        email.sendMailWithTemplate(receiver.getEmail(), "Xử lý yêu cầu nghỉ phép", "handle-request", values);

        return leaveAppsRepository.save(existingLeaveApp);
    }

    @Override
    public void deleteLeaveAppsByID(int id) {
        leaveAppsRepository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("LeaveApp", "Id", id));
        leaveAppsRepository.deleteById(id);
    }

}
