package com.github.yamaday0.infrastructure.repository;

import com.github.yamaday0.application.HashHistoryRepository;
import com.github.yamaday0.domain.model.HashHistory;
import org.springframework.stereotype.Repository;

@Repository
public class HashHistoryRepositoryImpl implements HashHistoryRepository {
    private final HasHistoryJpaRepository internalRepository;

    public HashHistoryRepositoryImpl(HasHistoryJpaRepository internalRepository) {
        this.internalRepository = internalRepository;
    }

    @Override
    public void save(HashHistory hashHistory) {
        HashHistoryJpaEntity jpaEntity = HashHistoryJpaEntity.from(hashHistory);
        internalRepository.save(jpaEntity);
    }
}
