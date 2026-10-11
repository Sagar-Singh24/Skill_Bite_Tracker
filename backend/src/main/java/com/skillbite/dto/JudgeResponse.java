package com.skillbite.dto;

import java.util.List;

public class JudgeResponse {
    private String verdict;       // AC, WA, TLE, RE, COMPILE_ERROR
    private long totalTimeMs;
    private List<TestCaseResult> results;
    private String compileError;

    public JudgeResponse() {}

    public JudgeResponse(String verdict, long totalTimeMs, List<TestCaseResult> results, String compileError) {
        this.verdict = verdict;
        this.totalTimeMs = totalTimeMs;
        this.results = results;
        this.compileError = compileError;
    }

    public String getVerdict() { return verdict; }
    public long getTotalTimeMs() { return totalTimeMs; }
    public List<TestCaseResult> getResults() { return results; }
    public String getCompileError() { return compileError; }
}
