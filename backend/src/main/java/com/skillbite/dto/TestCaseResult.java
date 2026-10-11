package com.skillbite.dto;

public class TestCaseResult {
    private int index;
    private String input;
    private String expectedOutput;
    private String actualOutput;
    private String status; // PASS, FAIL, TLE, RE
    private long executionTimeMs;
    private boolean hidden;

    public TestCaseResult() {}

    public TestCaseResult(int index, String input, String expectedOutput,
                          String actualOutput, String status, long executionTimeMs, boolean hidden) {
        this.index = index;
        this.input = input;
        this.expectedOutput = expectedOutput;
        this.actualOutput = actualOutput;
        this.status = status;
        this.executionTimeMs = executionTimeMs;
        this.hidden = hidden;
    }

    public int getIndex() { return index; }
    public String getInput() { return input; }
    public String getExpectedOutput() { return expectedOutput; }
    public String getActualOutput() { return actualOutput; }
    public String getStatus() { return status; }
    public long getExecutionTimeMs() { return executionTimeMs; }
    public boolean isHidden() { return hidden; }
}
