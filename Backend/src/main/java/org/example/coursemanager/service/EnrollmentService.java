package org.example.coursemanager.service;

import org.example.coursemanager.model.Course;
import org.example.coursemanager.model.Enrollment;
import org.example.coursemanager.model.User;
import org.example.coursemanager.repository.CourseRepository;
import org.example.coursemanager.repository.EnrollmentRepository;
import org.example.coursemanager.repository.UserRepository;
import org.example.coursemanager.security.CustomUserDetails;
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
    private UserService userService;
    @Autowired
    private CourseRepository courseRepository;

    public List<Enrollment> getAllEnrollMents(){
        CustomUserDetails principal = userService.getCurrentUser();
        if (principal.hasRole("STUDENT") || principal.hasRole("TEACHER")){
            User student = userRepository.findByEmail(principal.getEmail());

            return enrollmentRepository.findByUser(student);
        }
        return enrollmentRepository.findAll();
    }

    public List<Enrollment> getAllByCourseId(Long id){
        CustomUserDetails principal = userService.getCurrentUser();
//        if (principal.hasRole("STUDENT")){
//            User student = userRepository.findByEmail(principal.getEmail());
//
//            return enrollmentRepository.findByUser(student);
//        }
        List<Enrollment> found = enrollmentRepository.findAllByCourse_Id(id);


        return found;
    }




    public Enrollment createEnrollMent(Enrollment enrollment){
        CustomUserDetails principal = userService.getCurrentUser();
        User user = userRepository.findById(principal.getId()).orElseThrow(()-> new RuntimeException("User not found"));
        Course course = courseRepository.findById(enrollment.getCourse().getId()).orElseThrow(()-> new RuntimeException("Course not found"));
        boolean alreadyEnrolled = enrollmentRepository.existsByUser_IdAndCourse_Id(user.getId(),course.getId());

        if (alreadyEnrolled) throw new RuntimeException("Already enrolled this course");

        if (principal.hasRole("STUDENT")){
            if (!user.getId().equals(principal.getId())) {
                throw new RuntimeException("Students can only create enrollments for themselves!");
            }
        }
        if (principal.getId().equals(course.getTeacher().getId())) {
            throw new RuntimeException("You cannot enroll your own course!");
        }

        enrollment.setUser(user);
        enrollment.setCourse(course);

        return enrollmentRepository.save(enrollment);

    }

    public String deleteEnrollmentById(Long id){
        CustomUserDetails principal = userService.getCurrentUser();
        Enrollment found = enrollmentRepository.findById(id).orElseThrow(() -> new RuntimeException("Enrollment not found with id:" +id));

        if (principal.hasRole("STUDENT") && !found.getUser().getId().equals(principal.getId())) {
            throw new RuntimeException("Students can only delete their own enrollments!");
        }

        enrollmentRepository.deleteById(found.getEnrollment_id());

        return "Deleted!";
    }
}
