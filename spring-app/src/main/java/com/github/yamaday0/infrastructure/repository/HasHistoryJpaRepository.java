package com.github.yamaday0.infrastructure.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigInteger;

public interface HasHistoryJpaRepository extends JpaRepository<HashHistoryJpaEntity, BigInteger> {
}
