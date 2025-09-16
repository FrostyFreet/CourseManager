package org.example.coursemanager.security;

import org.example.coursemanager.JWT.JWTFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Autowired
    private JWTFilter jwtFilter;
    @Autowired
    private CustomUserDetailsService userDetailsService;
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, CustomUserDetailsService customUserDetailsService) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.disable())
                .authorizeHttpRequests(auth ->
                        auth
                                .requestMatchers("/auth/register", "/auth/login").permitAll()
                                //User security endpoints
                                .requestMatchers("/users/getAll").hasAnyRole("ADMIN","TEACHER")
                                .requestMatchers("/users/getById/*").hasAnyRole("ADMIN","TEACHER","STUDENT")
                                .requestMatchers("/users/create").hasRole("ADMIN")
                                .requestMatchers("/users/update/*").hasAnyRole("ADMIN","STUDENT")
                                .requestMatchers("/users/deleteByName/").hasRole("ADMIN")
                                //Course security endpoints
                                .requestMatchers("/course/getAll").hasAnyRole("ADMIN","TEACHER","STUDENT")
                                .requestMatchers("/course/getById/*").hasAnyRole("ADMIN","TEACHER","STUDENT")
                                .requestMatchers("/course/create").hasAnyRole("ADMIN","TEACHER")
                                .requestMatchers("/course/update").hasAnyRole("ADMIN","TEACHER")
                                .requestMatchers("/course/deleteById/*").hasAnyRole("ADMIN","TEACHER")
                                //Enrollment security endpoints
                                .requestMatchers("/enrollment/getAll").hasAnyRole("ADMIN","STUDENT")
                                .requestMatchers("/enrollment/create").hasAnyRole("ADMIN","STUDENT")
                                .requestMatchers("/enrollment/deleteById/*").hasAnyRole("ADMIN","STUDENT")
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider(CustomUserDetailsService userDetailsService, PasswordEncoder encoder){
        DaoAuthenticationProvider auth = new DaoAuthenticationProvider(userDetailsService);
        auth.setPasswordEncoder(encoder);

        return auth;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
