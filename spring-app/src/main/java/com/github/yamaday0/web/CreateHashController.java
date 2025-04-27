package com.github.yamaday0.web;

import com.github.yamaday0.application.CreateHashUseCase;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("hash")
public class CreateHashController {
    private final CreateHashUseCase createHashUseCase;

    public CreateHashController(CreateHashUseCase createHashUseCase) {
        this.createHashUseCase = createHashUseCase;
    }

    @PostMapping
    public CreateHashResponse createHash(@RequestBody @Valid CreateHashRequest request) {
        String hash = createHashUseCase.encrypt(request.input(), request.iterations());
        return new CreateHashResponse(hash);
    }
}
