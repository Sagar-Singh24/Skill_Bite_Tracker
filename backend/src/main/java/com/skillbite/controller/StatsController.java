package com.skillbite.controller;

import com.skillbite.model.Answer;
import com.skillbite.model.User;
import com.skillbite.repository.AnswerRepository;
import com.skillbite.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private final UserRepository userRepo;
    private final AnswerRepository answerRepo;

    public StatsController(UserRepository userRepo, AnswerRepository answerRepo) {
        this.userRepo = userRepo;
        this.answerRepo = answerRepo;
    }

    /** GET /api/stats/leaderboard — returns all users ranked by XP */
    @GetMapping("/leaderboard")
    public ResponseEntity<List<Map<String, Object>>> leaderboard() {
        List<User> users = userRepo.findAll();
        List<Map<String, Object>> board = new ArrayList<>();
        for (User u : users) {
            List<Answer> answers = answerRepo.findByUserId(u.getId());
            int xp = answers.stream().mapToInt(Answer::getXpEarned).sum();
            int streak = computeStreak(answers);
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("name", u.getName());
            row.put("email", u.getEmail());
            row.put("xp", xp);
            row.put("streak", streak);
            row.put("totalAnswers", answers.size());
            board.add(row);
        }
        board.sort((a, b) -> Integer.compare((int) b.get("xp"), (int) a.get("xp")));
        return ResponseEntity.ok(board);
    }

    /** GET /api/stats/me — returns detailed stats for the authenticated user */
    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> myStats(Authentication auth) {
        User user = userRepo.findByEmail(auth.getName()).orElseThrow();
        List<Answer> answers = answerRepo.findByUserId(user.getId());

        int totalXp = answers.stream().mapToInt(Answer::getXpEarned).sum();
        long correct = answers.stream().filter(Answer::isCorrect).count();
        int accuracy = answers.isEmpty() ? 0 : (int) Math.round(correct * 100.0 / answers.size());
        int streak = computeStreak(answers);
        int totalTimeSpent = answers.stream().mapToInt(Answer::getTimeSpent).sum();

        // XP per day for last 30 days
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MMM d").withZone(ZoneId.systemDefault());
        Map<String, Integer> xpByDay = new LinkedHashMap<>();
        for (int i = 29; i >= 0; i--) {
            Instant day = Instant.now().minus(i, ChronoUnit.DAYS).truncatedTo(ChronoUnit.DAYS);
            xpByDay.put(fmt.format(day), 0);
        }
        for (Answer a : answers) {
            if (a.getCompletedAt() == null) continue;
            Instant day = a.getCompletedAt().truncatedTo(ChronoUnit.DAYS);
            String key = fmt.format(day);
            if (xpByDay.containsKey(key)) xpByDay.merge(key, a.getXpEarned(), Integer::sum);
        }
        List<Map<String, Object>> xpChart = xpByDay.entrySet().stream().map(e -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("name", e.getKey());
            m.put("xp", e.getValue());
            return m;
        }).collect(Collectors.toList());

        // XP per category (skill mastery)
        Map<String, Integer> xpByCategory = new LinkedHashMap<>();
        for (Answer a : answers) {
            xpByCategory.merge(a.getSkillCategory(), a.getXpEarned(), Integer::sum);
        }
        List<Map<String, Object>> skillChart = xpByCategory.entrySet().stream()
            .sorted((a, b) -> b.getValue() - a.getValue())
            .map(e -> {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("subject", e.getKey());
                m.put("score", Math.min(100, e.getValue() / 5));
                return m;
            }).collect(Collectors.toList());

        // Focus area (pie) — answers count per category
        Map<String, Long> countByCategory = answers.stream()
            .collect(Collectors.groupingBy(a -> a.getSkillCategory() != null ? a.getSkillCategory() : "other", Collectors.counting()));
        String[] pieColors = {"#00d4aa", "#ff6b35", "#00aafe", "#9d4edd", "#ffa500", "#ff3366", "#22c55e", "#f59e0b"};
        List<Map<String, Object>> pieChart = new ArrayList<>();
        int ci = 0;
        for (Map.Entry<String, Long> e : countByCategory.entrySet()) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("name", e.getKey());
            m.put("value", e.getValue());
            m.put("color", pieColors[ci++ % pieColors.length]);
            pieChart.add(m);
        }

        // Weekly activity (last 7 days: answers per day)
        DateTimeFormatter dayFmt = DateTimeFormatter.ofPattern("EEE").withZone(ZoneId.systemDefault());
        Map<String, Integer> weeklyAnswers = new LinkedHashMap<>();
        for (int i = 6; i >= 0; i--) {
            Instant day = Instant.now().minus(i, ChronoUnit.DAYS).truncatedTo(ChronoUnit.DAYS);
            weeklyAnswers.put(dayFmt.format(day), 0);
        }
        for (Answer a : answers) {
            if (a.getCompletedAt() == null) continue;
            Instant day = a.getCompletedAt().truncatedTo(ChronoUnit.DAYS);
            String key = dayFmt.format(day);
            if (weeklyAnswers.containsKey(key)) weeklyAnswers.merge(key, 1, Integer::sum);
        }
        List<Map<String, Object>> weeklyChart = weeklyAnswers.entrySet().stream().map(e -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("day", e.getKey());
            m.put("study", e.getValue());
            m.put("pending", Math.max(0, 10 - e.getValue()));
            return m;
        }).collect(Collectors.toList());

        // Heatmap: last 364 days, count answers per day mapped to intensity 0-4
        Map<String, Integer> heatRaw = new LinkedHashMap<>();
        for (int i = 363; i >= 0; i--) {
            Instant day = Instant.now().minus(i, ChronoUnit.DAYS).truncatedTo(ChronoUnit.DAYS);
            heatRaw.put(day.toString().substring(0, 10), 0);
        }
        for (Answer a : answers) {
            if (a.getCompletedAt() == null) continue;
            String key = a.getCompletedAt().truncatedTo(ChronoUnit.DAYS).toString().substring(0, 10);
            if (heatRaw.containsKey(key)) heatRaw.merge(key, 1, Integer::sum);
        }
        List<Integer> heatmap = heatRaw.values().stream().map(v -> v == 0 ? 0 : v <= 2 ? 1 : v <= 4 ? 2 : v <= 6 ? 3 : 4).collect(Collectors.toList());

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalXp", totalXp);
        result.put("totalAnswers", answers.size());
        result.put("accuracy", accuracy);
        result.put("streak", streak);
        result.put("totalTimeSpentSeconds", totalTimeSpent);
        result.put("xpChart", xpChart);
        result.put("skillChart", skillChart);
        result.put("pieChart", pieChart);
        result.put("weeklyChart", weeklyChart);
        result.put("heatmap", heatmap);

        return ResponseEntity.ok(result);
    }

    private int computeStreak(List<Answer> answers) {
        if (answers.isEmpty()) return 0;
        Set<String> activeDays = answers.stream()
            .filter(a -> a.getCompletedAt() != null)
            .map(a -> a.getCompletedAt().truncatedTo(ChronoUnit.DAYS).toString().substring(0, 10))
            .collect(Collectors.toSet());
        int streak = 0;
        Instant day = Instant.now().truncatedTo(ChronoUnit.DAYS);
        while (activeDays.contains(day.toString().substring(0, 10))) {
            streak++;
            day = day.minus(1, ChronoUnit.DAYS);
        }
        return streak;
    }
}
