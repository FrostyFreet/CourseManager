package org.example.coursemanager.service;

import org.example.coursemanager.model.User;
import org.example.coursemanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

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


    public List<User> getAllUsers(){
        return userRepository.findAll();
    }

    public User getUserById(Long id){
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found with id: "+id));
    }

    public User getUserByName(String name){
        return userRepository.findByName(name).orElseThrow(() -> new RuntimeException("User not found with name: "+name));
    }

    public User register(User user){
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User updateUser(User user) {
        User foundUser = userRepository.findById(user.getId()).orElseThrow(() -> new UsernameNotFoundException("User not found with id: "+user.getId()));
        foundUser.setEmail(user.getEmail());

        return userRepository.save(foundUser);
    }

    public String deleteUserByName(String username){
        User foundUser = userRepository.findByName(username).orElseThrow(() -> new RuntimeException("User not found with username: "+ username));
        userRepository.delete(foundUser);

        return "Deleted " +username+ " from the database";
    }
}
