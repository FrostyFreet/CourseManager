package org.example.coursemanager.repository;

import org.example.coursemanager.model.Roles;
import org.example.coursemanager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByName(String name);
    User findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findAllByRolesNot(Roles role);}
