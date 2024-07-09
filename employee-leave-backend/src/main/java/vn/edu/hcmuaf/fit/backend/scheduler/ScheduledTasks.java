package vn.edu.hcmuaf.fit.backend.scheduler;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class ScheduledTasks {

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
//   Set a schedule for January 1 every year
    @Scheduled(cron = "0 0 0 1 1 *")
    public void updateDayOffRemaining() {
        entityManager.createNativeQuery("CALL update_day_off_remaining()")
                .executeUpdate();
    }
}

