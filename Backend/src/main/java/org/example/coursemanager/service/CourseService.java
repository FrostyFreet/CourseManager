package org.example.coursemanager.service;

import org.example.coursemanager.model.Course;
import org.example.coursemanager.model.Roles;
import org.example.coursemanager.model.User;
import org.example.coursemanager.repository.CourseRepository;
import org.example.coursemanager.repository.UserRepository;
import org.example.coursemanager.security.CustomUserDetails;
import org.hibernate.annotations.NotFoundAction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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
        List<Course> courses = courseRepository.findAll();
        List<User> courseTeachers = new ArrayList<>();
        courses.forEach(course -> {
            User found = userRepository.findById(course.getTeacher().getId()).orElseThrow(()-> new RuntimeException("User not found with id: "+course.getTeacher().getId()));
            courseTeachers.add(found);
        });

        return courses;
    }

    public Course getCourseById(Long id){
        return courseRepository.findById(id).orElseThrow(() -> new RuntimeException("Course not found with id:" + id));
    }

    public Course getCourseByTitle(String title){
        Course found = courseRepository.findByTitle(title);
        if (found == null) throw new RuntimeException("Course not found with tile: "+title);

        return found;
    }
    public List<Course> getCoursesByTeacherId(){
        CustomUserDetails principal = userService.getCurrentUser();
        User foundUser = userService.getUserById(principal.getId());
        List<Course> found = courseRepository.findAllByTeacher(foundUser);
        if (found == null) throw new RuntimeException("Courses not found with teacher: "+principal.getId());

        return found;
    }

    public String createCourse(Course course){
        try {
            CustomUserDetails principal = userService.getCurrentUser();

            User user = userRepository.findById(principal.getId()).orElseThrow(() -> new RuntimeException("User not found"));
            if (course.getTeacher() == null) {
                course.setTeacher(user);

                if (principal.hasRole("STUDENT")) {
                    user.setRoles(Roles.TEACHER);
                    userRepository.save(user);
                }
            } else {
                Long teacherId = course.getTeacher().getId();
                if (teacherId == null) {
                    throw new RuntimeException("Teacher ID is null");
                }
                User teacher = userRepository.findById(teacherId)
                        .orElseThrow(() -> new RuntimeException("Teacher not found"));
                course.setTeacher(teacher);
            }
            courseRepository.save(course);

            return "Course created!";

        }
        catch (Exception e){
            return "Course creation failed: "+e;
        }
    }

    public String updateCourse(Course course){
        CustomUserDetails principal = userService.getCurrentUser();
        Course foundCourse = courseRepository.findById(course.getId()).orElseThrow(() -> new RuntimeException("Course not found"));

        User user = foundCourse.getTeacher();

        if (principal.hasRole("TEACHER") && foundCourse.getTeacher().getId().equals(principal.getId())) {
            user = userRepository.findById(principal.getId())
                    .orElseThrow(() -> new RuntimeException("Teacher not found"));
        } else if (principal.hasRole("ADMIN") && course.getTeacher() != null) {
            user = userRepository.findById(course.getTeacher().getId())
                    .orElseThrow(() -> new RuntimeException("Teacher not found"));
        }

        if ((foundCourse.getTeacher().getId().equals(principal.getId()) && principal.hasRole("TEACHER"))
                || principal.hasRole("ADMIN")) {
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
