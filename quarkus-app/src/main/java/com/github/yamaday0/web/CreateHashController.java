package com.github.yamaday0.web;

import com.github.yamaday0.application.CreateHashUseCase;
import com.github.yamaday0.web.intercepter.Logged;
import jakarta.validation.Valid;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/hash")
@Logged
public class CreateHashController {
    private final CreateHashUseCase createHashUseCase;

    public CreateHashController(CreateHashUseCase createHashUseCase) {
        this.createHashUseCase = createHashUseCase;
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public CreateHashResponse encrypt(@Valid CreateHashRequest request) {
        String input = request.input();
        Integer iterations = request.iterations();

        String result = createHashUseCase.encrypt(input, iterations);
        return new CreateHashResponse(result);
    }
}
