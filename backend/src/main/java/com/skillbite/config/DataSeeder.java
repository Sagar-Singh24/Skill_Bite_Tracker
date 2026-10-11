package com.skillbite.config;

import com.skillbite.model.User;
import com.skillbite.repository.AnswerRepository;
import com.skillbite.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepo;
    private final AnswerRepository answerRepo;
    private final PasswordEncoder encoder;

    public DataSeeder(UserRepository userRepo, AnswerRepository answerRepo, PasswordEncoder encoder) {
        this.userRepo = userRepo;
        this.answerRepo = answerRepo;
        this.encoder = encoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        // Cleanup old mock data
        userRepo.findByEmail("ragnar@skillbite.app").ifPresent(this::deleteUserAndData);
        userRepo.findByEmail("floki@skillbite.app").ifPresent(this::deleteUserAndData);
        userRepo.findByEmail("bjorn@skillbite.app").ifPresent(this::deleteUserAndData);
        userRepo.findByEmail("leif@skillbite.app").ifPresent(this::deleteUserAndData);
        userRepo.findByEmail("lagertha@skillbite.app").ifPresent(this::deleteUserAndData);

        String dataFile = "CGUStudentsData.txt";
        if (!Files.exists(Paths.get(dataFile))) {
            System.err.println("Data file not found: " + dataFile);
            return;
        }

        String defaultPassword = encoder.encode("Student@123");

        try (BufferedReader br = new BufferedReader(new FileReader(dataFile))) {
            String line;
            boolean firstLine = true;
            int count = 0;

            while ((line = br.readLine()) != null) {
                if (firstLine) {
                    firstLine = false;
                    continue; // Skip header
                }

                String[] parts = line.split("\t");
                if (parts.length >= 3) {
                    String name = parts[0].trim();
                    String rollNumber = parts[1].trim();
                    String email = parts[2].trim();

                    if (!userRepo.existsByEmail(email)) {
                        User user = new User(name, rollNumber, email, defaultPassword);
                        userRepo.save(user);
                        count++;
                    }
                }
            }
            System.out.println("Imported " + count + " students from " + dataFile);
        } catch (IOException e) {
            System.err.println("Error reading student data: " + e.getMessage());
        }
    }

    private void deleteUserAndData(User user) {
        answerRepo.deleteByUserId(user.getId());
        userRepo.delete(user);
        System.out.println("Removed old mock user: " + user.getEmail());
    }
}
