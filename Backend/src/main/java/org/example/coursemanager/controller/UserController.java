package org.example.coursemanager.controller;

import org.example.coursemanager.model.User;
import org.example.coursemanager.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/api/users")
    public List<User> getAllUsers(){
        return userService.getAllUsers();
    }

    @GetMapping("/api/users/{id}")
    public User getUserById(@PathVariable Long id){
        return userService.getUserById(id);
    }

    @PutMapping("/api/user")
    public User updateUser(@RequestBody User user){
        return userService.updateUser(user);
    }

    @PostMapping("/api/user")
    public User createUser(@RequestBody User user){
        return userService.createUser(user);
    }

    @DeleteMapping("/api/user")
    public String deleteUserByName(@RequestBody String name){
        return userService.deleteUserByName(name);
    }
}
