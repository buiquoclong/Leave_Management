package vn.edu.hcmuaf.fit.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.hcmuaf.fit.backend.model.PasswordResetToken;

import java.time.LocalDateTime;
@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    void deleteAllByExpiryDateBefore(LocalDateTime expiryDate);
    PasswordResetToken findByToken(String token);
}