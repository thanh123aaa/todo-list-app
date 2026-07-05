package com.example.todo.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.todo.dto.TodoRequest;
import com.example.todo.dto.TodoResponse;
import com.example.todo.model.Priority;
import com.example.todo.service.TodoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TodoController.class)
public class TodoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TodoService todoService;

    @Autowired
    private ObjectMapper objectMapper;

    private TodoResponse sampleResponse;
    private TodoRequest validRequest;
    private TodoRequest invalidRequest;

    @BeforeEach
    void setUp() {
        sampleResponse = TodoResponse.builder()
                .id(1L)
                .title("Đọc sách")
                .description("Đọc 2 chương sách mỗi ngày")
                .completed(false)
                .priority(Priority.MEDIUM)
                .dueDate(LocalDateTime.of(2026, 8, 15, 12, 0))
                .build();

        validRequest = TodoRequest.builder()
                .title("Đọc sách")
                .description("Đọc 2 chương sách mỗi ngày")
                .completed(false)
                .priority(Priority.MEDIUM)
                .dueDate(LocalDateTime.of(2026, 8, 15, 12, 0))
                .build();

        // Invalid request: Blank title
        invalidRequest = TodoRequest.builder()
                .title("")
                .priority(Priority.MEDIUM)
                .build();
    }

    @Test
    void testCreateTodo_ValidRequest_ReturnsCreated() throws Exception {
        when(todoService.createTodo(any(TodoRequest.class))).thenReturn(sampleResponse);

        mockMvc.perform(post("/api/todos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.title").value("Đọc sách"))
                .andExpect(jsonPath("$.completed").value(false));

        verify(todoService, times(1)).createTodo(any(TodoRequest.class));
    }

    @Test
    void testCreateTodo_InvalidRequest_ReturnsBadRequest() throws Exception {
        mockMvc.perform(post("/api/todos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Bad Request"))
                .andExpect(jsonPath("$.message").value("Dữ liệu đầu vào không hợp lệ"))
                .andExpect(jsonPath("$.errors.title").value("Tiêu đề không được để trống"));

        verify(todoService, never()).createTodo(any(TodoRequest.class));
    }

    @Test
    void testGetTodoById_ReturnsTodo() throws Exception {
        when(todoService.getTodoById(1L)).thenReturn(sampleResponse);

        mockMvc.perform(get("/api/todos/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Đọc sách"));

        verify(todoService, times(1)).getTodoById(1L);
    }

    @Test
    void testDeleteTodo_ReturnsNoContent() throws Exception {
        doNothing().when(todoService).deleteTodo(1L);

        mockMvc.perform(delete("/api/todos/1"))
                .andExpect(status().isNoContent());

        verify(todoService, times(1)).deleteTodo(1L);
    }
}
