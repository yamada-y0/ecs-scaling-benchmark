package com.github.yamaday0.web;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateHashRequest(
        @NotNull @NotEmpty String input,
        @NotNull @Positive Integer iterations
) {
}
