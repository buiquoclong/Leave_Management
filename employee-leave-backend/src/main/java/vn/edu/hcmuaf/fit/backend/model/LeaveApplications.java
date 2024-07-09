package vn.edu.hcmuaf.fit.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.autoconfigure.domain.EntityScan;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Data
@NoArgsConstructor
@Entity
@EntityScan
@Table(name = "leave_application")
public class LeaveApplications {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @Column(name = "reason")
    private String reason;

    @Column(name = "start_date")
    private LocalDate from;

    @Column(name = "end_date")
    private LocalDate to;

    @Column(name = "status")
    private int status;

    @Column(name = "reason_reject")
    private String reasonReject;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "handle_by")
    private Employee handleBy;
}
