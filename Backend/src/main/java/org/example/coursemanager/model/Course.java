package org.example.coursemanager.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Date;


@Data
@Entity
@Table(name="courses")
@Getter
@Setter
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    private Date startDate;
    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    private User teacher;
}
