package com.github.yamaday0.application;

import com.github.yamaday0.application.support.TimeProvider;
import com.github.yamaday0.domain.model.HashHistory;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;

@ApplicationScoped
public class CreateHashUseCaseImpl implements CreateHashUseCase {
    private final HashHistoryRepository hashHistoryRepository;
    private final TimeProvider timeProvider;

    @Inject
    public CreateHashUseCaseImpl(HashHistoryRepository hashHistoryRepository, TimeProvider timeProvider) {
        this.hashHistoryRepository = hashHistoryRepository;
        this.timeProvider = timeProvider;
    }

    @Override
    @Transactional
    public String encrypt(String input, int iterations) {
        try {
            byte[] salt = new byte[16];
            new SecureRandom().nextBytes(salt);

            PBEKeySpec spec = new PBEKeySpec(input.toCharArray(), salt, iterations, 256);
            SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
            byte[] hash = factory.generateSecret(spec).getEncoded();
            String hashStr = Base64.getEncoder().encodeToString(hash);
            LocalDateTime now = timeProvider.now();
            hashHistoryRepository.save(new HashHistory(hashStr, iterations, salt, now));
            return hashStr;
        } catch (Exception e) {
            throw new RuntimeException("Hashing failed", e);
        }
    }
}
