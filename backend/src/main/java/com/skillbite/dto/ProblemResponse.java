package com.skillbite.dto;

import java.util.List;

public class ProblemResponse {
    private Long id;
    private String title;
    private String description;
    private String constraints;
    private String sampleInput;
    private String sampleOutput;
    private int timeLimitSeconds;
    private int memoryLimitMb;
    private List<PublicTestCase> testCases;

    public record PublicTestCase(Long id, String input, String expectedOutput) {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getConstraints() { return constraints; }
    public void setConstraints(String constraints) { this.constraints = constraints; }
    public String getSampleInput() { return sampleInput; }
    public void setSampleInput(String sampleInput) { this.sampleInput = sampleInput; }
    public String getSampleOutput() { return sampleOutput; }
    public void setSampleOutput(String sampleOutput) { this.sampleOutput = sampleOutput; }
    public int getTimeLimitSeconds() { return timeLimitSeconds; }
    public void setTimeLimitSeconds(int t) { this.timeLimitSeconds = t; }
    public int getMemoryLimitMb() { return memoryLimitMb; }
    public void setMemoryLimitMb(int m) { this.memoryLimitMb = m; }
    public List<PublicTestCase> getTestCases() { return testCases; }
    public void setTestCases(List<PublicTestCase> testCases) { this.testCases = testCases; }
}
