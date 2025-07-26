package com.github.yamaday0.domain.model;

import java.time.LocalDateTime;

public record HashHistory(
        String hash,
        int iterations,
        byte[] salt,
        LocalDateTime createDateTime
) {
}