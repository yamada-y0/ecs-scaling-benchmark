package com.github.yamaday0.application.support;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class TimeProviderImpl implements TimeProvider {
    @Override
    public LocalDateTime now() {
        return LocalDateTime.now();
    }
}
