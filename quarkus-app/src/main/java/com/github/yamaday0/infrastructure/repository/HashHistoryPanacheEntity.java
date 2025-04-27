package com.github.yamaday0.infrastructure.repository;

import com.github.yamaday0.domain.model.HashHistory;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "hash_history")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class HashHistoryPanacheEntity extends PanacheEntity {
    private String hash;
    private byte[] salt;
    private int iterations;
    private LocalDateTime createDateTime;

    public static HashHistoryPanacheEntity from(HashHistory history) {
        return new HashHistoryPanacheEntity(
                history.hash(),
                history.salt(),
                history.iterations(),
                history.createDateTime()
        );
    }
}
