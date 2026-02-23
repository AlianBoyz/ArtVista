package com.artvista.artvista.Backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.artvista.artvista.Backend.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
