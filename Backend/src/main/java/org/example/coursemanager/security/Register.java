package org.example.coursemanager.security;


import org.example.coursemanager.model.Roles;
import org.example.coursemanager.model.User;
import org.example.coursemanager.repository.UserRepository;
import org.example.coursemanager.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Register {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/auth/register")
    public String register(@RequestBody User user){
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if (user.getRoles() != null && user.getRoles() != Roles.STUDENT){
            return "You can't set role";
        }
        if (userRepository.existsByEmail(user.getEmail())){
            return "Email already in use";
        }

       userRepository.save(user);

       return "Registered!";
    }
}
