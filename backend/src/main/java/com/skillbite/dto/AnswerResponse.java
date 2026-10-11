package com.skillbite.dto;

public class AnswerResponse {
    private Long id;
    private String skillCategory;
    private int xpEarned;
    private boolean isCorrect;
    private String challengeName;
    private int timeSpent;
    private String completedAt;

    public Long getId() { return id; }
    public String getSkillCategory() { return skillCategory; }
    public int getXpEarned() { return xpEarned; }
    public boolean isCorrect() { return isCorrect; }
    public String getChallengeName() { return challengeName; }
    public int getTimeSpent() { return timeSpent; }
    public String getCompletedAt() { return completedAt; }

    public void setId(Long id) { this.id = id; }
    public void setSkillCategory(String skillCategory) { this.skillCategory = skillCategory; }
    public void setXpEarned(int xpEarned) { this.xpEarned = xpEarned; }
    public void setCorrect(boolean correct) { isCorrect = correct; }
    public void setChallengeName(String challengeName) { this.challengeName = challengeName; }
    public void setTimeSpent(int timeSpent) { this.timeSpent = timeSpent; }
    public void setCompletedAt(String completedAt) { this.completedAt = completedAt; }
}
