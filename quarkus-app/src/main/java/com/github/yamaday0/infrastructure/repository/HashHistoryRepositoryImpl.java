package com.github.yamaday0.infrastructure.repository;

import com.github.yamaday0.application.HashHistoryRepository;
import com.github.yamaday0.domain.model.HashHistory;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class HashHistoryRepositoryImpl implements HashHistoryRepository {
    @Override
    public void save(HashHistory hashHistory) {
        HashHistoryPanacheEntity entity = HashHistoryPanacheEntity.from(hashHistory);
        entity.persist();
    }
}
