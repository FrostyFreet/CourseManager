package org.example.coursemanager.service;

import org.example.coursemanager.model.Course;
import org.example.coursemanager.model.User;
import org.example.coursemanager.repository.CourseRepository;
import org.example.coursemanager.repository.UserRepository;
import org.hibernate.annotations.NotFoundAction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;
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
            User user = userRepository.findById(course.getTeacher().getId()).orElseThrow(() -> new RuntimeException("Teacher not found"));

            course.setTeacher(user);
            courseRepository.save(course);

            return "Course created!";
        }
        catch (Exception e){
            return "Course creation failed: "+e;
        }
    }

    public String updateCourse(Course course){
        Course foundCourse = courseRepository.findById(course.getId()).orElseThrow(() -> new RuntimeException("Course not found"));
        User user = userRepository.findById(course.getTeacher().getId()).orElseThrow(() -> new RuntimeException("Teacher not found"));

        foundCourse.setDescription(course.getDescription());
        foundCourse.setTitle(course.getTitle());
        foundCourse.setStartDate(course.getStartDate());
        foundCourse.setTeacher(user);

        courseRepository.save(foundCourse);

        return "Course updated!";

    }

    public String deleteCourseById(Long id){
        Course foundCourse = courseRepository.findById(id).orElseThrow(() -> new RuntimeException("Course not found"));

        courseRepository.deleteById(foundCourse.getId());

        return "Course deleted!";
    }

}
