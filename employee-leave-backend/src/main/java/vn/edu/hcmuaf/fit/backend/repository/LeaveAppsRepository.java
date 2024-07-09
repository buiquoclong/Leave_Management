package vn.edu.hcmuaf.fit.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.hcmuaf.fit.backend.model.Employee;
import vn.edu.hcmuaf.fit.backend.model.LeaveApplications;

import java.util.List;

@Repository
public interface LeaveAppsRepository extends JpaRepository<LeaveApplications, Integer> {

  List<LeaveApplications> findByHandleById(int handleBy);
  List<LeaveApplications> findByEmployeeId(int employeeId);
}
