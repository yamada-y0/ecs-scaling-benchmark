package com.github.yamaday0.web;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static io.restassured.module.mockmvc.RestAssuredMockMvc.given;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@AutoConfigureMockMvc
class CreateHashControllerTest {
    @Autowired
    MockMvc mockMvc;

    @Test
    @DisplayName("CreateHashResponseが返却されること")
    public void testEncrypt() {
        String input = "password";
        int iterations = 1000;

        CreateHashRequest request = new CreateHashRequest(input, iterations);
        CreateHashResponse response = given()
                .mockMvc(mockMvc)
                .contentType("application/json")
                .body(request)
                .when()
                .post("hash")
                .then()
                .statusCode(200)
                .extract()
                .as(CreateHashResponse.class);

        assertNotNull(response);
        assertNotNull(response.result());
        assertFalse(response.result().isEmpty());
    }

    @Test
    @DisplayName("inputが空文字の場合、400エラーが返却されること")
    public void testEncryptWithEmptyInput() {
        String input = "";
        int iterations = 1000;

        CreateHashRequest request = new CreateHashRequest(input, iterations);
        given()
                .mockMvc(mockMvc)
                .contentType("application/json")
                .body(request)
                .when()
                .post("hash")
                .then()
                .statusCode(400);
    }

    @Test
    @DisplayName("inputがnullの場合、400エラーが返却されること")
    public void testEncryptWithNullInput() {
        String input = null;
        int iterations = 1000;

        CreateHashRequest request = new CreateHashRequest(input, iterations);
        given()
                .mockMvc(mockMvc)
                .contentType("application/json")
                .body(request)
                .when()
                .post("hash")
                .then()
                .statusCode(400);
    }

    @Test
    @DisplayName("iterationsがnullの場合、400エラーが返却されること")
    public void testEncryptWithNullIterations() {
        String input = "password";
        Integer iterations = null;

        CreateHashRequest request = new CreateHashRequest(input, iterations);
        given()
                .mockMvc(mockMvc)
                .contentType("application/json")
                .body(request)
                .when()
                .post("hash")
                .then()
                .statusCode(400);
    }

    @Test
    @DisplayName("iterationsが0の場合、400エラーが返却されること")
    public void testEncryptWithZeroIterations() {
        String input = "password";
        int iterations = 0;

        CreateHashRequest request = new CreateHashRequest(input, iterations);
        given()
                .mockMvc(mockMvc)
                .contentType("application/json")
                .body(request)
                .when()
                .post("hash")
                .then()
                .statusCode(400);
    }

    @Test
    @DisplayName("iterationsが負の値の場合、400エラーが返却されること")
    public void testEncryptWithNegativeIterations() {
        String input = "password";
        int iterations = -1;

        CreateHashRequest request = new CreateHashRequest(input, iterations);
        given()
                .mockMvc(mockMvc)
                .contentType("application/json")
                .body(request)
                .when()
                .post("hash")
                .then()
                .statusCode(400);
    }

}
