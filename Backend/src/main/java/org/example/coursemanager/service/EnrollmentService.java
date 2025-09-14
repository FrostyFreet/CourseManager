package org.example.coursemanager.service;

import org.example.coursemanager.model.Course;
import org.example.coursemanager.model.Enrollment;
import org.example.coursemanager.model.User;
import org.example.coursemanager.repository.CourseRepository;
import org.example.coursemanager.repository.EnrollmentRepository;
import org.example.coursemanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EnrollmentService {

    @Autowired
    private EnrollmentRepository enrollmentRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CourseRepository courseRepository;

    public List<Enrollment> getAllEnrollMents(){
        return enrollmentRepository.findAll();
    }

    public Enrollment createEnrollMent(Enrollment enrollment){
        User user = userRepository.findById(enrollment.getUser().getId()).orElseThrow(()-> new RuntimeException("User not found"));
        Course course = courseRepository.findById(enrollment.getCourse().getId()).orElseThrow(()-> new RuntimeException("Course not found"));

        enrollment.setUser(user);
        enrollment.setCourse(course);

        return enrollmentRepository.save(enrollment);

    }

    public String deleteEnrollMentById(Long id){
        Enrollment found = enrollmentRepository.findById(id).orElseThrow(() -> new RuntimeException("Enrollment not found with id:" +id));


        enrollmentRepository.deleteById(found.getEnrollment_id());

        return "Deleted!";
    }
}
