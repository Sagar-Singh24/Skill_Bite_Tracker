package com.skillbite.repository;

import com.skillbite.model.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AnswerRepository extends JpaRepository<Answer, Long> {
    List<Answer> findByUserId(Long userId);
    void deleteByUserId(Long userId);
}
