package org.example.coursemanager.security;


import jakarta.servlet.http.HttpServletResponse;
import org.example.coursemanager.JWT.JWTService;
import org.example.coursemanager.model.RefreshToken;
import org.example.coursemanager.model.Roles;
import org.example.coursemanager.model.User;
import org.example.coursemanager.repository.RefreshTokenRepository;
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

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;


@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class Authentication {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

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
            User user = userRepository.findById(userDetails.getId()).orElseThrow(()-> new RuntimeException("User not found!"));
            String token = jwtService.generateToken(userDetails.getEmail(), userDetails.getAuthorities().iterator().next().getAuthority());

            String refreshTokenStr = UUID.randomUUID().toString();

            RefreshToken refreshToken = new RefreshToken();

            refreshToken.setToken(refreshTokenStr);
            refreshToken.setExpiryDate(Instant.now().plus(7, ChronoUnit.DAYS));
            refreshToken.setUser(user);
            refreshTokenRepository.save(refreshToken);

            Map<String,String> header = new HashMap<>();

            header.put("role", userDetails.getAuthorities().iterator().next().getAuthority());
            header.put("token",token);
            header.put("refreshToken",refreshTokenStr);

            return ResponseEntity.ok(header);

        }
        else{
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Bad username/password!"));
        }
    }

    @PostMapping("/auth/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request) {
        String requestToken = request.get("refreshToken");

        RefreshToken oldToken = refreshTokenRepository.findByToken(requestToken)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));

        if (oldToken.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(oldToken);
            throw new RuntimeException("Refresh token expired");
        }

        refreshTokenRepository.delete(oldToken);

        String newRefreshTokenStr = UUID.randomUUID().toString();
        RefreshToken newToken = new RefreshToken();
        newToken.setToken(newRefreshTokenStr);
        newToken.setUser(oldToken.getUser());
        newToken.setExpiryDate(Instant.now().plus(7, ChronoUnit.DAYS));
        refreshTokenRepository.save(newToken);

        String newAccessToken = jwtService.generateToken(
                oldToken.getUser().getEmail(),
                "ROLE_" + oldToken.getUser().getRoles().name()
        );

        Map<String, String> response = new HashMap<>();
        response.put("token", newAccessToken);
        response.put("refreshToken", newRefreshTokenStr);

        return ResponseEntity.ok(response);
    }



}
