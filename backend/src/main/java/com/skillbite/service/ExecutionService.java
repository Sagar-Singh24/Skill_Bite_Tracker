package com.skillbite.service;

import org.springframework.stereotype.Service;
import java.io.*;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.*;

@Service
public class ExecutionService {

    private static final String DOCKER_JAVA_IMAGE = "openjdk:17-slim";
    private static final String DOCKER_PYTHON_IMAGE = "python:3.11-slim";
    private static final String DOCKER_CPP_IMAGE = "gcc:12";

    public record ExecutionResult(String output, String error, long elapsedMs, boolean timedOut) {}

    public ExecutionResult execute(String code, String language, String input,
                                   int timeLimitSeconds, int memoryLimitMb) throws IOException, InterruptedException {
        Path workDir = Files.createTempDirectory("judge_" + UUID.randomUUID());
        try {
            return switch (language.toLowerCase()) {
                case "java"   -> executeJava(code, input, workDir, timeLimitSeconds, memoryLimitMb);
                case "python" -> executePython(code, input, workDir, timeLimitSeconds, memoryLimitMb);
                case "cpp"    -> executeCpp(code, input, workDir, timeLimitSeconds, memoryLimitMb);
                default -> throw new IllegalArgumentException("Unsupported language: " + language);
            };
        } finally {
            deleteDir(workDir);
        }
    }

    private ExecutionResult executeJava(String code, String input, Path workDir,
                                         int timeLimitSeconds, int memoryLimitMb) throws IOException, InterruptedException {
        Files.writeString(workDir.resolve("Solution.java"), code);
        Files.writeString(workDir.resolve("input.txt"), input == null ? "" : input);

        String compileCmd = String.join(" ",
            "docker run --rm",
            "--network none",
            "--memory=" + memoryLimitMb + "m",
            "--memory-swap=" + memoryLimitMb + "m",
            "--cpus=1",
            "-v", workDir.toAbsolutePath() + ":/code",
            "-w /code",
            DOCKER_JAVA_IMAGE,
            "javac Solution.java"
        );

        ExecutionResult compileResult = runProcess(compileCmd, null, 30);
        if (!compileResult.error().isBlank() && compileResult.output().isBlank()) {
            return new ExecutionResult("", "COMPILE_ERROR: " + compileResult.error(), 0, false);
        }

        String runCmd = String.join(" ",
            "docker run --rm",
            "--network none",
            "--memory=" + memoryLimitMb + "m",
            "--memory-swap=" + memoryLimitMb + "m",
            "--cpus=1",
            "--read-only",
            "--tmpfs /tmp:size=64m",
            "-v", workDir.toAbsolutePath() + ":/code:ro",
            "-w /code",
            DOCKER_JAVA_IMAGE,
            "sh -c \"java -Xmx" + (memoryLimitMb - 64) + "m Solution < input.txt\""
        );

        return runProcess(runCmd, null, timeLimitSeconds + 5);
    }

    private ExecutionResult executePython(String code, String input, Path workDir,
                                           int timeLimitSeconds, int memoryLimitMb) throws IOException, InterruptedException {
        Files.writeString(workDir.resolve("solution.py"), code);
        Files.writeString(workDir.resolve("input.txt"), input == null ? "" : input);

        String runCmd = String.join(" ",
            "docker run --rm",
            "--network none",
            "--memory=" + memoryLimitMb + "m",
            "--memory-swap=" + memoryLimitMb + "m",
            "--cpus=1",
            "--read-only",
            "--tmpfs /tmp:size=64m",
            "-v", workDir.toAbsolutePath() + ":/code:ro",
            "-w /code",
            DOCKER_PYTHON_IMAGE,
            "sh -c \"python solution.py < input.txt\""
        );

        return runProcess(runCmd, null, timeLimitSeconds + 5);
    }

    private ExecutionResult executeCpp(String code, String input, Path workDir,
                                        int timeLimitSeconds, int memoryLimitMb) throws IOException, InterruptedException {
        Files.writeString(workDir.resolve("solution.cpp"), code);
        Files.writeString(workDir.resolve("input.txt"), input == null ? "" : input);

        String compileCmd = String.join(" ",
            "docker run --rm",
            "--network none",
            "--memory=" + memoryLimitMb + "m",
            "--memory-swap=" + memoryLimitMb + "m",
            "--cpus=1",
            "-v", workDir.toAbsolutePath() + ":/code",
            "-w /code",
            DOCKER_CPP_IMAGE,
            "g++ -O2 -o solution solution.cpp"
        );

        ExecutionResult compileResult = runProcess(compileCmd, null, 30);
        if (!compileResult.error().isBlank() && compileResult.output().isBlank()) {
            return new ExecutionResult("", "COMPILE_ERROR: " + compileResult.error(), 0, false);
        }

        String runCmd = String.join(" ",
            "docker run --rm",
            "--network none",
            "--memory=" + memoryLimitMb + "m",
            "--memory-swap=" + memoryLimitMb + "m",
            "--cpus=1",
            "--read-only",
            "--tmpfs /tmp:size=64m",
            "-v", workDir.toAbsolutePath() + ":/code:ro",
            "-w /code",
            DOCKER_CPP_IMAGE,
            "sh -c \"./solution < input.txt\""
        );

        return runProcess(runCmd, null, timeLimitSeconds + 5);
    }

    private ExecutionResult runProcess(String cmd, String stdinInput, int timeoutSeconds)
            throws IOException, InterruptedException {
        ProcessBuilder pb = new ProcessBuilder("cmd.exe", "/c", cmd);
        pb.redirectErrorStream(false);
        long start = System.currentTimeMillis();
        Process process = pb.start();

        if (stdinInput != null) {
            try (OutputStream os = process.getOutputStream()) {
                os.write(stdinInput.getBytes());
            }
        }

        ExecutorService executor = Executors.newFixedThreadPool(2);
        Future<String> stdoutFuture = executor.submit(() -> readStream(process.getInputStream()));
        Future<String> stderrFuture = executor.submit(() -> readStream(process.getErrorStream()));

        boolean finished = process.waitFor(timeoutSeconds, TimeUnit.SECONDS);
        long elapsed = System.currentTimeMillis() - start;

        if (!finished) {
            process.destroyForcibly();
            executor.shutdownNow();
            return new ExecutionResult("", "Time Limit Exceeded", elapsed, true);
        }

        String stdout = "";
        String stderr = "";
        try {
            stdout = stdoutFuture.get(5, TimeUnit.SECONDS);
            stderr = stderrFuture.get(5, TimeUnit.SECONDS);
        } catch (ExecutionException | TimeoutException e) {
            stderr = e.getMessage();
        }
        executor.shutdown();

        return new ExecutionResult(stdout, stderr, elapsed, false);
    }

    private String readStream(InputStream is) {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(is))) {
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) sb.append(line).append("\n");
            return sb.toString().stripTrailing();
        } catch (IOException e) {
            return "";
        }
    }

    private void deleteDir(Path dir) {
        try {
            Files.walk(dir).sorted((a, b) -> b.compareTo(a)).forEach(p -> {
                try { Files.delete(p); } catch (IOException ignored) {}
            });
        } catch (IOException ignored) {}
    }
}
