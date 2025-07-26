package com.github.yamaday0.infrastructure.repository;

import com.github.yamaday0.application.HashHistoryRepository;
import com.github.yamaday0.domain.model.HashHistory;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@ApplicationScoped
public class HashHistoryRepositoryImpl implements HashHistoryRepository {
    
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public void save(HashHistory hashHistory) {
        HashHistoryEntity entity = HashHistoryEntity.from(hashHistory);
        entityManager.persist(entity);
    }
}