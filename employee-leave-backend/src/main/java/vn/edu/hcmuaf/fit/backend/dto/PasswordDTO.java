package vn.edu.hcmuaf.fit.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PasswordDTO {
    @JsonProperty("old_password")
    @NotBlank(message = "Mật khẩu cũ không được để trống")
    private String oldPassword;
    @JsonProperty("new_password")
    @NotBlank(message = "Mật khẩu mới không được để trống")
    private String newPassword;
}
