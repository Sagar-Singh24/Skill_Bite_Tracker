package com.skillbite.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "answers")
public class Answer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    private String skillCategory;
    private int xpEarned;
    private boolean isCorrect;
    private String challengeName;
    private int timeSpent;
    private Instant completedAt;

    public Answer() {}

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public String getSkillCategory() { return skillCategory; }
    public int getXpEarned() { return xpEarned; }
    public boolean isCorrect() { return isCorrect; }
    public String getChallengeName() { return challengeName; }
    public int getTimeSpent() { return timeSpent; }
    public Instant getCompletedAt() { return completedAt; }

    public void setUserId(Long userId) { this.userId = userId; }
    public void setSkillCategory(String skillCategory) { this.skillCategory = skillCategory; }
    public void setXpEarned(int xpEarned) { this.xpEarned = xpEarned; }
    public void setCorrect(boolean correct) { isCorrect = correct; }
    public void setChallengeName(String challengeName) { this.challengeName = challengeName; }
    public void setTimeSpent(int timeSpent) { this.timeSpent = timeSpent; }
    public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt; }
}
