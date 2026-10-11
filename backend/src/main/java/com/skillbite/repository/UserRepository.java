package com.skillbite.repository;

import com.skillbite.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByEmailOrRollNumber(String email, String rollNumber);
    boolean existsByEmail(String email);
}
