package com.skillbite.service;

import com.skillbite.dto.*;
import com.skillbite.model.*;
import com.skillbite.repository.*;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class JudgeService {

    private final ExecutionService executionService;
    private final ProblemRepository problemRepo;
    private final TestCaseRepository testCaseRepo;
    private final SubmissionRepository submissionRepo;
    private final UserRepository userRepo;

    public JudgeService(ExecutionService executionService, ProblemRepository problemRepo,
                        TestCaseRepository testCaseRepo, SubmissionRepository submissionRepo,
                        UserRepository userRepo) {
        this.executionService = executionService;
        this.problemRepo = problemRepo;
        this.testCaseRepo = testCaseRepo;
        this.submissionRepo = submissionRepo;
        this.userRepo = userRepo;
    }

    public JudgeResponse run(CodeRequest req) {
        Problem problem = problemRepo.findById(req.getProblemId())
                .orElseThrow(() -> new RuntimeException("Problem not found"));
        List<TestCase> testCases = testCaseRepo.findByProblemIdAndHidden(req.getProblemId(), false);
        return judge(req.getCode(), req.getLanguage(), testCases, problem, false);
    }

    public JudgeResponse submit(CodeRequest req, String userEmail) {
        Problem problem = problemRepo.findById(req.getProblemId())
                .orElseThrow(() -> new RuntimeException("Problem not found"));
        List<TestCase> testCases = testCaseRepo.findByProblemId(req.getProblemId());
        JudgeResponse response = judge(req.getCode(), req.getLanguage(), testCases, problem, true);

        User user = userRepo.findByEmail(userEmail).orElse(null);
        if (user != null) {
            Submission submission = new Submission();
            submission.setUser(user);
            submission.setProblem(problem);
            submission.setCode(req.getCode());
            submission.setLanguage(req.getLanguage());
            submission.setVerdict(response.getVerdict());
            submission.setExecutionTimeMs(response.getTotalTimeMs());
            submissionRepo.save(submission);
        }

        return response;
    }

    private JudgeResponse judge(String code, String language, List<TestCase> testCases,
                                 Problem problem, boolean isSubmit) {
        List<TestCaseResult> results = new ArrayList<>();
        String overallVerdict = "AC";
        long totalTime = 0;

        for (int i = 0; i < testCases.size(); i++) {
            TestCase tc = testCases.get(i);
            try {
                ExecutionService.ExecutionResult result = executionService.execute(
                        code, language, tc.getInput(),
                        problem.getTimeLimitSeconds(), problem.getMemoryLimitMb());

                totalTime = Math.max(totalTime, result.elapsedMs());

                if (result.error().startsWith("COMPILE_ERROR")) {
                    return new JudgeResponse("COMPILE_ERROR", 0, List.of(), result.error());
                }

                String status;
                if (result.timedOut()) {
                    status = "TLE";
                    overallVerdict = worstVerdict(overallVerdict, "TLE");
                } else if (!result.error().isBlank() && result.output().isBlank()) {
                    status = "RE";
                    overallVerdict = worstVerdict(overallVerdict, "RE");
                } else if (normalize(result.output()).equals(normalize(tc.getExpectedOutput()))) {
                    status = "PASS";
                } else {
                    status = "FAIL";
                    overallVerdict = worstVerdict(overallVerdict, "WA");
                }

                // For hidden test cases in submit mode, mask input/expected
                String displayInput = (isSubmit && tc.isHidden()) ? "[hidden]" : tc.getInput();
                String displayExpected = (isSubmit && tc.isHidden()) ? "[hidden]" : tc.getExpectedOutput();

                results.add(new TestCaseResult(i + 1, displayInput, displayExpected,
                        result.output(), status, result.elapsedMs(), tc.isHidden()));

            } catch (Exception e) {
                results.add(new TestCaseResult(i + 1, tc.getInput(), tc.getExpectedOutput(),
                        "", "RE", 0, tc.isHidden()));
                overallVerdict = worstVerdict(overallVerdict, "RE");
            }
        }

        return new JudgeResponse(overallVerdict, totalTime, results, null);
    }

    private String normalize(String s) {
        if (s == null) return "";
        return s.lines()
                .map(String::stripTrailing)
                .reduce((a, b) -> a + "\n" + b)
                .orElse("")
                .strip();
    }

    private String worstVerdict(String current, String incoming) {
        List<String> priority = List.of("AC", "WA", "TLE", "RE");
        return priority.indexOf(incoming) > priority.indexOf(current) ? incoming : current;
    }

    public ProblemResponse getProblem(Long id) {
        Problem p = problemRepo.findById(id).orElseThrow(() -> new RuntimeException("Problem not found"));
        List<TestCase> publicCases = testCaseRepo.findByProblemIdAndHidden(id, false);

        ProblemResponse resp = new ProblemResponse();
        resp.setId(p.getId());
        resp.setTitle(p.getTitle());
        resp.setDescription(p.getDescription());
        resp.setConstraints(p.getConstraints());
        resp.setSampleInput(p.getSampleInput());
        resp.setSampleOutput(p.getSampleOutput());
        resp.setTimeLimitSeconds(p.getTimeLimitSeconds());
        resp.setMemoryLimitMb(p.getMemoryLimitMb());
        resp.setTestCases(publicCases.stream()
                .map(tc -> new ProblemResponse.PublicTestCase(tc.getId(), tc.getInput(), tc.getExpectedOutput()))
                .toList());
        return resp;
    }

    public List<ProblemResponse> listProblems() {
        return problemRepo.findAll().stream().map(p -> {
            ProblemResponse r = new ProblemResponse();
            r.setId(p.getId());
            r.setTitle(p.getTitle());
            r.setDescription(p.getDescription());
            r.setConstraints(p.getConstraints());
            r.setSampleInput(p.getSampleInput());
            r.setSampleOutput(p.getSampleOutput());
            r.setTimeLimitSeconds(p.getTimeLimitSeconds());
            r.setMemoryLimitMb(p.getMemoryLimitMb());
            r.setTestCases(List.of());
            return r;
        }).toList();
    }

    public List<SubmissionResponse> getHistory(String userEmail) {
        User user = userRepo.findByEmail(userEmail).orElseThrow();
        return submissionRepo.findByUserIdOrderBySubmittedAtDesc(user.getId()).stream()
                .map(s -> {
                    SubmissionResponse r = new SubmissionResponse();
                    r.setId(s.getId());
                    r.setProblemId(s.getProblem().getId());
                    r.setProblemTitle(s.getProblem().getTitle());
                    r.setLanguage(s.getLanguage());
                    r.setVerdict(s.getVerdict());
                    r.setExecutionTimeMs(s.getExecutionTimeMs());
                    r.setSubmittedAt(s.getSubmittedAt());
                    return r;
                }).toList();
    }
}
