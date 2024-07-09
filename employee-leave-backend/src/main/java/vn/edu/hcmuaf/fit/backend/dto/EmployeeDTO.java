package vn.edu.hcmuaf.fit.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class EmployeeDTO {
    private int userId;
    private String username;
    private String password;
    private String email;
    private String fullName;
    private int bossId;
    private String position;
    private int dayOffRemaining;
    private LocalDateTime firstDayOfWork;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public String getFormattedId() {
        return String.format("%06d", this.userId);
    }

}
