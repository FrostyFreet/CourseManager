package org.example.coursemanager.service;

import org.example.coursemanager.model.Course;
import org.example.coursemanager.model.User;
import org.example.coursemanager.repository.CourseRepository;
import org.example.coursemanager.repository.UserRepository;
import org.example.coursemanager.security.CustomUserDetails;
import org.hibernate.annotations.NotFoundAction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;

    public List<Course> getAllCourse(){
        return courseRepository.findAll();
    }

    public Course getCourseById(Long id){
        return courseRepository.findById(id).orElseThrow(() -> new RuntimeException("Course not found with id:" + id));
    }

    public String createCourse(Course course){
        try {
            CustomUserDetails principal = userService.getCurrentUser();
            if (principal.hasRole("ADMIN") || principal.hasRole("TEACHER")){
                User user = userRepository.findById(course.getTeacher().getId()).orElseThrow(() -> new RuntimeException("Teacher not found"));

                course.setTeacher(user);
                courseRepository.save(course);

                return "Course created!";
            }
           else{
               return "You don't have permission to create a course!";
            }
        }
        catch (Exception e){
            return "Course creation failed: "+e;
        }
    }

    public String updateCourse(Course course){
        CustomUserDetails principal = userService.getCurrentUser();
        Course foundCourse = courseRepository.findById(course.getId()).orElseThrow(() -> new RuntimeException("Course not found"));
        User user = userRepository.findById(course.getTeacher().getId()).orElseThrow(() -> new RuntimeException("Teacher not found"));
        if ((foundCourse.getTeacher().getId().equals(principal.getId()) && principal.hasRole("TEACHER")) || principal.hasRole("ADMIN")){
            foundCourse.setDescription(course.getDescription());
            foundCourse.setTitle(course.getTitle());
            foundCourse.setStartDate(course.getStartDate());
            foundCourse.setTeacher(user);

            courseRepository.save(foundCourse);

            return "Course updated!";
        }

        return "You don't have permission to update this course!";
    }

    public String deleteCourseById(Long id){
        CustomUserDetails principal = userService.getCurrentUser();
        Course foundCourse = courseRepository.findById(id).orElseThrow(() -> new RuntimeException("Course not found"));

        if ((foundCourse.getTeacher().getId().equals(principal.getId()) && principal.hasRole("TEACHER")) || principal.hasRole("ADMIN")){
            courseRepository.deleteById(foundCourse.getId());

            return "Course deleted!";
        }

        return "You don't have permission to delete this course!";
    }

}
