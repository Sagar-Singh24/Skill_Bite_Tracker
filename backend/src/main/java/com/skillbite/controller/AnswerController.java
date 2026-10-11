package com.skillbite.controller;

import com.skillbite.dto.AnswerRequest;
import com.skillbite.dto.AnswerResponse;
import com.skillbite.service.AnswerService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/answers")
public class AnswerController {

    private final AnswerService answerService;

    public AnswerController(AnswerService answerService) {
        this.answerService = answerService;
    }

    @GetMapping
    public ResponseEntity<List<AnswerResponse>> getAnswers(Authentication auth) {
        return ResponseEntity.ok(answerService.getAnswers(auth.getName()));
    }

    @PostMapping
    public ResponseEntity<AnswerResponse> saveAnswer(@RequestBody AnswerRequest req, Authentication auth) {
        return ResponseEntity.ok(answerService.saveAnswer(auth.getName(), req));
    }
}
