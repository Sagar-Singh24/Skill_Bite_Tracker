package com.skillbite.controller;

import com.skillbite.dto.*;
import com.skillbite.service.JudgeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
public class JudgeController {

    private final JudgeService judgeService;

    public JudgeController(JudgeService judgeService) {
        this.judgeService = judgeService;
    }

    @GetMapping("/problem/{id}")
    public ResponseEntity<ProblemResponse> getProblem(@PathVariable Long id) {
        return ResponseEntity.ok(judgeService.getProblem(id));
    }

    @GetMapping("/problems")
    public ResponseEntity<List<ProblemResponse>> listProblems() {
        // Returns all problems (without test cases) - useful for problem list page
        return ResponseEntity.ok(judgeService.listProblems());
    }

    @PostMapping("/run")
    public ResponseEntity<JudgeResponse> run(@RequestBody CodeRequest req) {
        return ResponseEntity.ok(judgeService.run(req));
    }

    @PostMapping("/submit")
    public ResponseEntity<JudgeResponse> submit(@RequestBody CodeRequest req,
                                                 @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(judgeService.submit(req, userDetails.getUsername()));
    }

    @GetMapping("/submissions")
    public ResponseEntity<List<SubmissionResponse>> getHistory(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(judgeService.getHistory(userDetails.getUsername()));
    }
}
