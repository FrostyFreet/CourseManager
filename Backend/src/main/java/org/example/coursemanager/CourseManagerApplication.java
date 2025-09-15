package org.example.coursemanager;

import org.example.coursemanager.model.Roles;
import org.example.coursemanager.model.User;
import org.example.coursemanager.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class CourseManagerApplication {

    public static void main(String[] args) {
        SpringApplication.run(CourseManagerApplication.class, args);
    }

    @Bean
    CommandLineRunner addAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder){
        return args -> {
            if (!userRepository.existsByEmail("admin@gmail.com")) {
                User admin = new User();
                admin.setName("System Admin");
                admin.setEmail("admin@gmail.com");
                admin.setPassword(passwordEncoder.encode("admin"));
                admin.setRoles(Roles.ADMIN);
                userRepository.save(admin);
                System.out.println("✅ Admin user created with default credentials");
            }
        };
    }

}
