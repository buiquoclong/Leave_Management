package vn.edu.hcmuaf.fit.backend.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.edu.hcmuaf.fit.backend.Util.Email;
import vn.edu.hcmuaf.fit.backend.Util.PasswordUtil;
import vn.edu.hcmuaf.fit.backend.Util.SaltStringUtil;
import vn.edu.hcmuaf.fit.backend.dto.EmployeeDTO;
import vn.edu.hcmuaf.fit.backend.dto.PasswordDTO;
import vn.edu.hcmuaf.fit.backend.exception.ResourceNotFoundException;
import vn.edu.hcmuaf.fit.backend.model.Employee;
import vn.edu.hcmuaf.fit.backend.model.PasswordResetToken;
import vn.edu.hcmuaf.fit.backend.repository.EmployeeRepository;
import vn.edu.hcmuaf.fit.backend.repository.PasswordResetTokenRepository;
import vn.edu.hcmuaf.fit.backend.service.EmployeeService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class EmployeeServiceImpl implements EmployeeService {
    @Autowired
    private EmployeeRepository employeeRepository;
    @Autowired
    private PasswordResetTokenRepository passwordResetTokenReponsitory;
    @Autowired
    private SaltStringUtil saltStringUtil;
    @Autowired
    private Email emailUtil;
    @Autowired
    private PasswordUtil passwordUtil;
    private String link = "http://localhost:3000";

    public EmployeeServiceImpl(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Override
    public Employee saveEmployee(EmployeeDTO employeeDTO) {
        Employee employee = new Employee();

        Employee boss = employeeRepository.findById(employeeDTO.getBossId()).orElseThrow(() ->
                new ResourceNotFoundException("Boss", "Id", employeeDTO.getBossId()));

        employee.setUsername(employeeDTO.getUsername());
        employee.setPassword(passwordUtil.hashPassword(employeeDTO.getPassword()));
        employee.setEmail(employeeDTO.getEmail());
        employee.setFullName(employeeDTO.getFullName());
        employee.setBossId(boss);
        employee.setPosition(employeeDTO.getPosition());
        employee.setDayOffRemaining(12);
        employee.setFirstDayOfWork(LocalDateTime.now());
        employee.setCreatedAt(LocalDateTime.now());
        employee.setUpdatedAt(LocalDateTime.now());
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
        Employee e = employeeRepository.findByUsername(username);
        if (e != null && passwordUtil.checkPass(pass, e.getPassword())) {
            return e.getId() + "";
        }
        return "Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin đăng nhập!";
    }

    @Override
    public String forgotPassword(String email) throws Exception {
        Employee e = employeeRepository.findByEmail(email);
        if (e == null) return "email chưa tồn tại trong hệ thống.";
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime timeValid = now.plusMinutes(5);
        String token = saltStringUtil.getSaltString();
        PasswordResetToken passwordResetToken = PasswordResetToken.builder()
                .token(token)
                .expiryDate(timeValid)
                .employee(e)
                .build();
        passwordResetTokenReponsitory.save(passwordResetToken);
//        sửa lại đường link sau khi tạo ra trang xong nha
        String resetLink = link + "/api/reset-password?token=" + token + "&employeeId=" + e.getId();
        Map<String, String> values = Map.of("link", resetLink);
        emailUtil.sendMailWithTemplate(e.getEmail(), "Đặt lại mật khẩu", "reset-password", values);
        return "Link đặt lại mật khẩu đã được gửi đến email của bạn! Vui lòng tiến hành đặt lại mật khẩu trong vòng 5 phút!";
    }

    @Override
    public String resetPassword(String token, String password) throws Exception {
        PasswordResetToken passwordResetToken = passwordResetTokenReponsitory.findByToken(token);
        if (passwordResetToken == null || passwordResetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            return "Token không hợp lệ hoặc đã hết hạn! Vui lòng gửi lại yêu cầu đặt lại mật khẩu!";
        }
        Employee e = passwordResetToken.getEmployee();
        e.setPassword(passwordUtil.hashPassword(password));
        employeeRepository.save(e);
        passwordResetTokenReponsitory.delete(passwordResetToken);

        return "Đặt lại mật khẩu thành công!";
    }

    @Override
    public String updatePassword(PasswordDTO passwordDTO, int employeeId) throws Exception {
        Employee e = employeeRepository.findById(employeeId).orElseThrow(() ->
                new ResourceNotFoundException("Employee", "Id", employeeId));
        if (!passwordUtil.checkPass(passwordDTO.getOldPassword(), e.getPassword())) {
            return "Mật khẩu cũ không đúng! Vui lòng thử lại";
        }
        e.setPassword(passwordUtil.hashPassword(passwordDTO.getNewPassword()));
        employeeRepository.save(e);
        return "Đổi mật khẩu thành công!";
    }

    @Override
    public List<Employee> getEmployeeByBossId(int bossId) {
        return employeeRepository.findByBossId_Id(bossId);
    }

}
