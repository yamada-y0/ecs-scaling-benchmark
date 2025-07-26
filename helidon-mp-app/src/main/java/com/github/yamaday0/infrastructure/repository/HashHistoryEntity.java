package com.github.yamaday0.infrastructure.repository;

import com.github.yamaday0.domain.model.HashHistory;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "hash_history")
@Getter
@NoArgsConstructor
public class HashHistoryEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String hash;
    private byte[] salt;
    private int iterations;
    private LocalDateTime createDateTime;

    public HashHistoryEntity(String hash, byte[] salt, int iterations, LocalDateTime createDateTime) {
        this.hash = hash;
        this.salt = salt;
        this.iterations = iterations;
        this.createDateTime = createDateTime;
    }

    public static HashHistoryEntity from(HashHistory history) {
        return new HashHistoryEntity(
                history.hash(),
                history.salt(),
                history.iterations(),
                history.createDateTime()
        );
    }

}
