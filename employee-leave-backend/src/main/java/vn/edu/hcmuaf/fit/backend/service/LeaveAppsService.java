package vn.edu.hcmuaf.fit.backend.service;

import vn.edu.hcmuaf.fit.backend.dto.LeaveApplicationsDTO;
import vn.edu.hcmuaf.fit.backend.model.LeaveApplications;

import java.util.List;


public interface LeaveAppsService {
    LeaveApplications saveLeaveApps(int employeeId, LeaveApplicationsDTO leaveApps) throws Exception;
    List<LeaveApplications> getAllLeaveApp();
    LeaveApplications getLeaveAppsByID(int id);
    List<LeaveApplications> getLeaveAppsByEmployeeId(int employeeId);
    List<LeaveApplications> getLeaveAppsByHandleById(int handleBy);
    LeaveApplications approveLeaveAppsByID(int id, LeaveApplicationsDTO leaveApps) throws Exception;
    void deleteLeaveAppsByID(int id);
}
