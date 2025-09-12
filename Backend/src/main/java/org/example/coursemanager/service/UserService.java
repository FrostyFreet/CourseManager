package org.example.coursemanager.service;

import org.example.coursemanager.model.User;
import org.example.coursemanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers(){
        return userRepository.findAll();
    }

    public User getUserById(@RequestParam Long id){
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found with id: "+id));
    }

    public User createUser(@RequestBody User user){
        return userRepository.save(user);
    }

    public User updateUser(@RequestBody User user){
        User foundUser = userRepository.findByUserName(user.getName()).orElseThrow(() -> new RuntimeException("User not found with username: "+ user.getName()));
        foundUser.setEmail(user.getEmail());
        foundUser.setPassword(user.getPassword());

        return userRepository.save(foundUser);
    }

    public String deleteUserByName(@RequestBody String username){
        User foundUser = userRepository.findByUserName(username).orElseThrow(() -> new RuntimeException("User not found with username: "+ username));
        userRepository.delete(foundUser);

        return "Deleted " +username+ " from the database";
    }
}
