package com.github.yamaday0;

import org.springframework.boot.SpringApplication;

public class TestApplication {
    public static void main(String[] args) {
        SpringApplication
                .from(SpringAppApplication::main)
                .with(ContainersConfig.class)
                .run(args);
    }
}
