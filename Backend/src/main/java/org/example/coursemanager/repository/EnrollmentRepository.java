package org.example.coursemanager.repository;

import org.example.coursemanager.model.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long > {
}
