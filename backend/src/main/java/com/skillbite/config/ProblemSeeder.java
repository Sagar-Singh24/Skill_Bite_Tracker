package com.skillbite.config;

import com.skillbite.model.Problem;
import com.skillbite.model.TestCase;
import com.skillbite.repository.ProblemRepository;
import com.skillbite.repository.TestCaseRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Order(2)
public class ProblemSeeder implements CommandLineRunner {

    private final ProblemRepository problemRepo;
    private final TestCaseRepository testCaseRepo;

    public ProblemSeeder(ProblemRepository problemRepo, TestCaseRepository testCaseRepo) {
        this.problemRepo = problemRepo;
        this.testCaseRepo = testCaseRepo;
    }

    @Override
    public void run(String... args) {
        if (problemRepo.count() > 0) return;

        seedProblem(
            "Two Sum",
            "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nReturn the answer in any order.",
            "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9",
            "4\n2 7 11 15\n9",
            "0 1",
            List.of(
                tc("4\n2 7 11 15\n9", "0 1", false),
                tc("3\n3 2 4\n6", "1 2", false),
                tc("2\n3 3\n6", "0 1", true),
                tc("5\n1 5 3 7 2\n9", "1 3", true)
            )
        );

        seedProblem(
            "Reverse String",
            "Write a function that reverses a string. The input string is given as an array of characters `s`.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.\n\nPrint the reversed string on a single line.",
            "1 <= s.length <= 10^5\ns[i] is a printable ASCII character.",
            "hello",
            "olleh",
            List.of(
                tc("hello", "olleh", false),
                tc("Hannah", "hannaH", false),
                tc("abcdefg", "gfedcba", true),
                tc("a", "a", true)
            )
        );

        seedProblem(
            "FizzBuzz",
            "Given an integer `n`, for each integer `i` from 1 to n:\n- Print `FizzBuzz` if i is divisible by both 3 and 5.\n- Print `Fizz` if i is divisible by 3.\n- Print `Buzz` if i is divisible by 5.\n- Otherwise print `i`.\n\nPrint each value on a new line.",
            "1 <= n <= 10^4",
            "15",
            "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz",
            List.of(
                tc("15", "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz", false),
                tc("3", "1\n2\nFizz", false),
                tc("5", "1\n2\nFizz\n4\nBuzz", true),
                tc("1", "1", true)
            )
        );

        System.out.println("Seeded 3 sample coding problems.");
    }

    private void seedProblem(String title, String description, String constraints,
                              String sampleInput, String sampleOutput, List<TestCase> testCases) {
        Problem p = new Problem();
        p.setTitle(title);
        p.setDescription(description);
        p.setConstraints(constraints);
        p.setSampleInput(sampleInput);
        p.setSampleOutput(sampleOutput);
        p.setTimeLimitSeconds(2);
        p.setMemoryLimitMb(256);
        Problem saved = problemRepo.save(p);
        testCases.forEach(tc -> {
            tc.setProblem(saved);
            testCaseRepo.save(tc);
        });
    }

    private TestCase tc(String input, String expected, boolean hidden) {
        TestCase tc = new TestCase();
        tc.setInput(input);
        tc.setExpectedOutput(expected);
        tc.setHidden(hidden);
        return tc;
    }
}
