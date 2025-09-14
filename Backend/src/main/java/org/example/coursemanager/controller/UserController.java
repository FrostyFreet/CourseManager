package org.example.coursemanager.controller;

import org.example.coursemanager.model.User;
import org.example.coursemanager.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController()
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAllUsers(Authentication auth){
        if (auth.getAuthorities().equals("ROLE_USER")){
            throw new RuntimeException("You dont have access to this path");
        }

        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id){

        return userService.getUserById(id);
    }
    @GetMapping("/by-name/{name}")
    public User getUserByName(@PathVariable String name){

        return userService.getUserByName(name);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User user) {
        user.setId(id);
        return userService.updateUser(user);
    }

    @PostMapping
    public User createUser(@RequestBody User user){
        return userService.register(user);
    }

    @DeleteMapping("/{name}")
    public String deleteUserByName(@PathVariable String name){
        return userService.deleteUserByName(name);
    }
}
