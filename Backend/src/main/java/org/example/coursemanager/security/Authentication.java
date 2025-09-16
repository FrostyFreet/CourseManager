package org.example.coursemanager.security;


import org.example.coursemanager.JWT.JWTService;
import org.example.coursemanager.model.Roles;
import org.example.coursemanager.model.User;
import org.example.coursemanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


@RestController
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
    public ResponseEntity<String> login(@RequestBody User loginRequest) {
        org.springframework.security.core.Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        if (authentication.isAuthenticated()){
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            String token = jwtService.generateToken(userDetails.getEmail());
            return ResponseEntity.ok()
                    .header(HttpHeaders.AUTHORIZATION,"Bearer "+token)
                    .body("Logged in!");
        }
        else{
            return new ResponseEntity<>("Bad username/password!", HttpStatus.BAD_REQUEST);
        }
    }

}
