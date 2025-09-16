package org.example.coursemanager.controller;

import org.example.coursemanager.model.User;
import org.example.coursemanager.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController()
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/getAll")
    public List<User> getAllUsers(){
        return userService.getAllUsers();
    }

    @GetMapping("/getById/{id}")
    public User getUserById(@PathVariable Long id){

        return userService.getUserById(id);
    }
    @GetMapping("/getByName/{name}")
    public User getUserByName(@PathVariable String name){

        return userService.getUserByName(name);
    }

    @PutMapping("/update/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User user) {
        user.setId(id);
        return userService.updateUser(user);
    }

    @PostMapping("/create")
    public String createUser(@RequestBody User user){
        return userService.register(user);
    }

    @DeleteMapping("/deletByName/{name}")
    public String deleteUserByName(@PathVariable String name){
        return userService.deleteUserByName(name);
    }
}
