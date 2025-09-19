package org.example.coursemanager.security;


import jakarta.servlet.http.HttpServletResponse;
import org.example.coursemanager.JWT.JWTService;
import org.example.coursemanager.model.Roles;
import org.example.coursemanager.model.User;
import org.example.coursemanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;


@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class Authentication {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    private JWTService jwtService;

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

    @PostMapping("/auth/login")
    public ResponseEntity< Map<String,String> > login(@RequestBody User loginRequest, HttpServletResponse response) {
        org.springframework.security.core.Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        if (authentication.isAuthenticated()){
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            String token = jwtService.generateToken(userDetails.getEmail(), userDetails.getAuthorities().iterator().next().getAuthority());

            Map<String,String> header = new HashMap<>();

            header.put("role", userDetails.getAuthorities().iterator().next().getAuthority());
            header.put("token",token);
            return ResponseEntity.ok(header);

        }
        else{
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Bad username/password!"));
        }
    }




}
