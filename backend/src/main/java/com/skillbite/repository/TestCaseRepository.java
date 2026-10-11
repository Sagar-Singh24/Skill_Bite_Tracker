package com.skillbite.repository;

import com.skillbite.model.TestCase;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TestCaseRepository extends JpaRepository<TestCase, Long> {
    List<TestCase> findByProblemId(Long problemId);
    List<TestCase> findByProblemIdAndHidden(Long problemId, boolean hidden);
}
