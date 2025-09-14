package org.example.coursemanager.controller;

import org.example.coursemanager.model.Enrollment;
import org.example.coursemanager.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/enrollment")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    @GetMapping("/getAll")
    public List<Enrollment> getAllEnrollMents(){
        return enrollmentService.getAllEnrollMents();
    }

    @PostMapping("/create")
    public Enrollment createEnrollMent(@RequestBody Enrollment enrollment){
        return enrollmentService.createEnrollMent(enrollment);
    }

    @DeleteMapping("/deletById/{id}")
    public String deleteEnrollMentById(@PathVariable Long id){
        return enrollmentService.deleteEnrollMentById(id);
    }
}
