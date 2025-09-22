package org.example.coursemanager.controller;

import org.example.coursemanager.model.Enrollment;
import org.example.coursemanager.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/enrollment")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    @GetMapping("/getAll")
    public List<Enrollment> getAllEnrollMents(){
        return enrollmentService.getAllEnrollMents();
    }

    @GetMapping("/getAllByCourseId/{id}")
    public List<Enrollment> getAllByCourseId(@PathVariable Long id){
        return enrollmentService.getAllByCourseId(id);
    }

    @PostMapping("/create")
    public Enrollment createEnrollMent(@RequestBody Enrollment enrollment){
        return enrollmentService.createEnrollMent(enrollment);
    }

    @DeleteMapping("/deleteById/{id}")
    public String deleteEnrollmentById(@PathVariable Long id){
        return enrollmentService.deleteEnrollmentById(id);
    }
}
