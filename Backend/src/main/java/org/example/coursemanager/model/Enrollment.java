package org.example.coursemanager.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name ="enrollments")
public class Enrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long enrollment_id;
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;
}
