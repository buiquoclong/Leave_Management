package vn.edu.hcmuaf.fit.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.hcmuaf.fit.backend.model.Employee;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

    Employee findByUsernameAndPassword(String username, String password);
    Employee findByUsername(String username);
    Employee findByEmail(String email);
    List<Employee> findByBossId_Id(int bossId);
}
