package com.github.yamaday0.web;

import io.quarkus.test.common.http.TestHTTPEndpoint;
import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@TestHTTPEndpoint(CreateHashController.class)
class CreateHashControllerTest {
    @Test
    @DisplayName("CreateHashResponseが返却されること")
    public void testEncrypt() {
        String input = "password";
        int iterations = 1000;

        CreateHashRequest request = new CreateHashRequest(input, iterations);
        CreateHashResponse response = given()
                .contentType("application/json")
                .body(request)
                .when()
                .post()
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
                .contentType("application/json")
                .body(request)
                .when()
                .post()
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
                .contentType("application/json")
                .body(request)
                .when()
                .post()
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
                .contentType("application/json")
                .body(request)
                .when()
                .post()
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
                .contentType("application/json")
                .body(request)
                .when()
                .post()
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
                .contentType("application/json")
                .body(request)
                .when()
                .post()
                .then()
                .statusCode(400);
    }
}
