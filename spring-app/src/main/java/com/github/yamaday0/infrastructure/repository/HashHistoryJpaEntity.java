package com.github.yamaday0.infrastructure.repository;

import com.github.yamaday0.domain.model.HashHistory;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigInteger;
import java.time.LocalDateTime;

@Entity
@Table(name = "hash_history")
@Getter
@NoArgsConstructor
public class HashHistoryJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private BigInteger id;
    private String hash;
    @Lob
    private byte[] salt;
    private int iterations;
    private LocalDateTime createDateTime;

    public HashHistoryJpaEntity(String hash, byte[] salt, int iterations, LocalDateTime dateTime) {
        this.hash = hash;
        this.salt = salt;
        this.iterations = iterations;
        this.createDateTime = dateTime;
    }

    public static HashHistoryJpaEntity from(HashHistory history) {
        return new HashHistoryJpaEntity(
                history.hash(),
                history.salt(),
                history.iterations(),
                history.createDateTime()
        );
    }
}
