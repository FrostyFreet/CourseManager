package org.example.coursemanager.controller;


import org.example.coursemanager.model.Course;
import org.example.coursemanager.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController()
@RequestMapping("/course")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @GetMapping("/getAll")
    public List<Course> getAllCourse(){
        return courseService.getAllCourse();
    }

    @GetMapping("/getByTitle/{title}")
    public Course getCourseByTitle(@PathVariable String title){
        return courseService.getCourseByTitle(title);
    }

    @GetMapping("/getCoursesByTeacher")
    public List<Course> getCourseByTitle(){
        return courseService.getCoursesByTeacherId();
    }

    @GetMapping("/getById/{id}")
    public Course getCourseById(@PathVariable Long id){
        return courseService.getCourseById(id);
    }

    @PostMapping("/create")
    public String createCourse(@RequestBody Course course){
        return courseService.createCourse(course);
    }

    @PutMapping("/update")
    public String updateCourse(@RequestBody Course course){
        return courseService.updateCourse(course);
    }

    @DeleteMapping("/deleteById/{id}")
    public String deleteCourseById(@PathVariable Long id){
        return courseService.deleteCourseById(id);
    }
}
