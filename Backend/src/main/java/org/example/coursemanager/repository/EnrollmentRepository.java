package org.example.coursemanager.repository;

import org.example.coursemanager.model.Enrollment;
import org.example.coursemanager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long > {
    List<Enrollment> findByUser(User user);
}
