package com.skillbite.service;

import com.skillbite.dto.AnswerRequest;
import com.skillbite.dto.AnswerResponse;
import com.skillbite.model.Answer;
import com.skillbite.repository.AnswerRepository;
import com.skillbite.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnswerService {

    private final AnswerRepository answerRepository;
    private final UserRepository userRepository;

    public AnswerService(AnswerRepository answerRepository, UserRepository userRepository) {
        this.answerRepository = answerRepository;
        this.userRepository = userRepository;
    }

    public List<AnswerResponse> getAnswers(String email) {
        Long userId = userRepository.findByEmail(email).orElseThrow().getId();
        return answerRepository.findByUserId(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public AnswerResponse saveAnswer(String email, AnswerRequest req) {
        Long userId = userRepository.findByEmail(email).orElseThrow().getId();
        Answer answer = new Answer();
        answer.setUserId(userId);
        answer.setSkillCategory(req.getSkillCategory());
        answer.setXpEarned(req.getXpEarned());
        answer.setCorrect(req.isCorrect());
        answer.setChallengeName(req.getChallengeName());
        answer.setTimeSpent(req.getTimeSpent());
        answer.setCompletedAt(req.getCompletedAt() != null ? Instant.parse(req.getCompletedAt()) : Instant.now());
        return toResponse(answerRepository.save(answer));
    }

    private AnswerResponse toResponse(Answer a) {
        AnswerResponse r = new AnswerResponse();
        r.setId(a.getId());
        r.setSkillCategory(a.getSkillCategory());
        r.setXpEarned(a.getXpEarned());
        r.setCorrect(a.isCorrect());
        r.setChallengeName(a.getChallengeName());
        r.setTimeSpent(a.getTimeSpent());
        r.setCompletedAt(a.getCompletedAt() != null ? a.getCompletedAt().toString() : null);
        return r;
    }
}
