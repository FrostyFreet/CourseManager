package org.example.coursemanager.controller;


import org.example.coursemanager.model.Course;
import org.example.coursemanager.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController()
@RequestMapping("/course")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @GetMapping
    public List<Course> getAllCourse(){
        return courseService.getAllCourse();
    }

    @GetMapping("/{id}")
    public Course getCourseById(@PathVariable Long id){
        return courseService.getCourseById(id);
    }

    @PostMapping
    public String createCourse(@RequestBody Course course){
        return courseService.createCourse(course);
    }

    @PutMapping
    public String updateCourse(@RequestBody Course course){
        return courseService.updateCourse(course);
    }

    @DeleteMapping("/{id}")
    public String deleteCourseById(@PathVariable Long id){
        return courseService.deleteCourseById(id);
    }
}
