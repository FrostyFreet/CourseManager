package org.example.coursemanager.service;

import org.example.coursemanager.model.Roles;
import org.example.coursemanager.model.User;
import org.example.coursemanager.repository.UserRepository;
import org.example.coursemanager.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public CustomUserDetails getCurrentUser(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null){
            throw new RuntimeException("No authenticated user found");
        }

        return (CustomUserDetails) auth.getPrincipal();
    }

    public List<User> getAllUsers(){
        CustomUserDetails principal = getCurrentUser();
        if (principal.hasRole("TEACHER")){
            return userRepository.findAllByRolesNot(Roles.ADMIN);
        }
        return userRepository.findAll();
    }

    public User getUserById(Long id){
        CustomUserDetails principal = getCurrentUser();
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found with id: "+id));
        if (principal.hasRole("STUDENT")){
            return userRepository.findByEmail(principal.getEmail());
        }
        if (principal.hasRole("TEACHER") && user.getRoles() == Roles.ADMIN){
            throw new RuntimeException("Teachers cannot access admins");
        }

        return user;
    }

    public User getUserByName(String name){
        return userRepository.findByName(name).orElseThrow(() -> new RuntimeException("User not found with name: "+name));
    }

    public String register(User user){
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if (userRepository.existsByEmail(user.getEmail())){
            return "Email already in use";
        }

        userRepository.save(user);

        return "User Created!";
    }

    public User updateUser(User user) {
        CustomUserDetails principal = getCurrentUser();
        User foundUser = userRepository.findById(user.getId()).orElseThrow(() -> new UsernameNotFoundException("User not found with id: "+user.getId()));

        if (principal.hasRole("STUDENT")){
           throw new RuntimeException("You can't change other people's credentials");

        }
        foundUser.setEmail(user.getEmail());
        foundUser.setPassword(passwordEncoder.encode(user.getPassword()));
        foundUser.setName(user.getName());
        foundUser.setRoles(user.getRoles());

        return userRepository.save(foundUser);
    }

    public String deleteUserByName(String username){
        User foundUser = userRepository.findByName(username).orElseThrow(() -> new RuntimeException("User not found with username: "+ username));
        userRepository.delete(foundUser);

        return "Deleted " +username+ " from the database";
    }
}
