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

import static vn.edu.hcmuaf.fit.backend.Util.Email.sendMail;

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
                                                             @RequestBody LeaveApplicationsDTO leaveApps) {
        Employee employee = employeeService.getEmployeeByID(employeeId);
        Employee boss = employeeService.getEmployeeByID(employee.getBossId().getId());

        sendMail(boss.getEmail(), "Bạn có một số đơn xin nghỉ phép cần xử lý", "Thông báo xử lý đơn xin nghỉ phép");

        return new ResponseEntity<>(leaveAppsService.saveLeaveApps(employeeId, leaveApps), HttpStatus.CREATED);
    }

    @GetMapping("{id}")
    public ResponseEntity<LeaveApplications> getEmployeeById(@PathVariable("id") int id) {
        return new ResponseEntity<>(leaveAppsService.getLeaveAppsByID(id), HttpStatus.OK);
    }

    // Approve Leave Application
    @PutMapping("/approve/{id}")
    public ResponseEntity<LeaveApplications> approveLeaveApps(@PathVariable("id") int id,
                                                              @RequestBody LeaveApplicationsDTO leaveAppsDTO) {
        LeaveApplications leaveApplications = leaveAppsService.getLeaveAppsByID(id);
        Employee sender = employeeService.getEmployeeByID(leaveApplications.getEmployee().getId());
        Employee reciver = employeeService.getEmployeeByID(leaveApplications.getHandleBy().getId());
        String status = "";
        String reason = "";
        switch (leaveAppsDTO.getStatus()) {
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
        if (leaveAppsDTO.getReasonReject().isEmpty()) {
            reason = "Không có.";
        }
        sendMail(sender.getEmail(), getContentMail(id + "", sender.getFullName(), reciver.getFullName(), status, reason), "Thông báo xử lý đơn xin nghỉ phép");
        return new ResponseEntity<>(leaveAppsService.approveLeaveAppsByID(id, leaveAppsDTO), HttpStatus.OK);
    }

    @GetMapping("/get-by-employee-id/{employeeId}")
    public List<LeaveApplications> getLeaveAppsByEmployeeId(@PathVariable("employeeId") int employeeId) {
        return leaveAppsService.getLeaveAppsByEmployeeId(employeeId);
    }

    @GetMapping("/get-by-handle-by/{handleBy}")
    public List<LeaveApplications> getLeaveAppsByHandleBy(@PathVariable("handleBy") int handleBy) {
        return leaveAppsService.getLeaveAppsByHandleById(handleBy);
    }


    public String getContentMail(String leaveID, String sender, String reciver, String status, String reason) {
        String content = "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n" +
                "<html dir=\"ltr\" xmlns=\"http://www.w3.org/1999/xhtml\" xmlns:o=\"urn:schemas-microsoft-com:office:office\">\n" +
                "\n" +
                "<head>\n" +
                "    <meta charset=\"UTF-8\">\n" +
                "    <meta content=\"width=device-width, initial-scale=1\" name=\"viewport\">\n" +
                "    <meta name=\"x-apple-disable-message-reformatting\">\n" +
                "    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n" +
                "    <meta content=\"telephone=no\" name=\"format-detection\">\n" +
                "    <title></title>\n" +
                "    <!--[if (mso 16)]>\n" +
                "    <style type=\"text/css\">\n" +
                "    a {text-decoration: none;}\n" +
                "    </style>\n" +
                "    <![endif]-->\n" +
                "    <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->\n" +
                "    <!--[if gte mso 9]>\n" +
                "<xml>\n" +
                "    <o:OfficeDocumentSettings>\n" +
                "    <o:AllowPNG></o:AllowPNG>\n" +
                "    <o:PixelsPerInch>96</o:PixelsPerInch>\n" +
                "    </o:OfficeDocumentSettings>\n" +
                "</xml>\n" +
                "<![endif]-->\n" +
                "</head>\n" +
                "\n" +
                "<body>\n" +
                "    <div dir=\"ltr\" class=\"es-wrapper-color\">\n" +
                "        <!--[if gte mso 9]>\n" +
                "\t\t\t<v:background xmlns:v=\"urn:schemas-microsoft-com:vml\" fill=\"t\">\n" +
                "\t\t\t\t<v:fill type=\"tile\" color=\"#fafafa\"></v:fill>\n" +
                "\t\t\t</v:background>\n" +
                "\t\t<![endif]-->\n" +
                "        <table class=\"es-wrapper\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\">\n" +
                "            <tbody>\n" +
                "                <tr>\n" +
                "                    <td class=\"esd-email-paddings\" valign=\"top\">\n" +
                "                        <table cellpadding=\"0\" cellspacing=\"0\" class=\"es-content esd-footer-popover\" align=\"center\">\n" +
                "                            <tbody>\n" +
                "                                <tr>\n" +
                "                                    <td class=\"esd-stripe\" align=\"center\">\n" +
                "                                        <table bgcolor=\"#ffffff\" class=\"es-content-body\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" width=\"600\">\n" +
                "                                            <tbody>\n" +
                "                                                <tr>\n" +
                "                                                    <td class=\"esd-structure es-p30t es-p30b es-p20r es-p20l\" align=\"left\">\n" +
                "                                                        <table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">\n" +
                "                                                            <tbody>\n" +
                "                                                                <tr>\n" +
                "                                                                    <td width=\"560\" class=\"esd-container-frame\" align=\"center\" valign=\"top\">\n" +
                "                                                                        <table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">\n" +
                "                                                                            <tbody>\n" +
                "                                                                                <tr>\n" +
                "                                                                                    <td align=\"center\" class=\"esd-block-image es-p10t es-p10b\" style=\"font-size: 0px;\"><a target=\"_blank\"><img src=\"https://ehepctz.stripocdn.email/content/guids/CABINET_67e080d830d87c17802bd9b4fe1c0912/images/55191618237638326.png\" alt style=\"display: block;\" width=\"100\"></a></td>\n" +
                "                                                                                </tr>\n" +
                "                                                                                <tr>\n" +
                "                                                                                    <td align=\"center\" class=\"esd-block-text es-p10b es-m-txt-c\">\n" +
                "                                                                                        <h2 style=\"font-size: 32px; line-height: 100%;\">Xác nhận duyệt đơn xin nghỉ phép</h2>\n" +
                "                                                                                    </td>\n" +
                "                                                                                </tr>\n" +
                "                                                                                <tr>\n" +
                "                                                                                    <td align=\"left\" class=\"esd-block-text es-p5t es-p5b es-p40r es-p40l es-m-p0r es-m-p0l\">\n" +
                "                                                                                        <p>Xin chào,</p>\n" +
                "                                                                                        <p>Chúng tôi đã duyệt đơn xin nghỉ phép của bạn.</p>\n" +
                "                                                                                        <p><br></p>\n" +
                "                                                                                        <p>Mã đơn: " + leaveID + ":</p>\n" +
                "                                                                                        <p>Tên người gửi: " + sender + "<br>Tên người duyệt: " + reciver + "</p>\n" +
                "                                                                                        <p>Trạng thái: <strong>" + status + "</strong></p>\n" +
                "                                                                                        <p>Lý do: " + reason + "</p>\n" +
                "                                                                                    </td>\n" +
                "                                                                                </tr>\n" +
                "                                                                            </tbody>\n" +
                "                                                                        </table>\n" +
                "                                                                    </td>\n" +
                "                                                                </tr>\n" +
                "                                                            </tbody>\n" +
                "                                                        </table>\n" +
                "                                                    </td>\n" +
                "                                                </tr>\n" +
                "                                            </tbody>\n" +
                "                                        </table>\n" +
                "                                    </td>\n" +
                "                                </tr>\n" +
                "                            </tbody>\n" +
                "                        </table>\n" +
                "                    </td>\n" +
                "                </tr>\n" +
                "            </tbody>\n" +
                "        </table>\n" +
                "    </div>\n" +
                "</body>\n" +
                "\n" +
                "</html>";
        return content;
    }
}
