package com.example.todo.service;

import com.example.todo.dto.TodoRequest;
import com.example.todo.dto.TodoResponse;
import com.example.todo.exception.ResourceNotFoundException;
import com.example.todo.model.Priority;
import com.example.todo.model.Todo;
import com.example.todo.repository.TodoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TodoServiceTest {

    @Mock
    private TodoRepository todoRepository;

    @InjectMocks
    private TodoServiceImpl todoService;

    private Todo sampleTodo;
    private TodoRequest sampleRequest;

    @BeforeEach
    void setUp() {
        sampleTodo = Todo.builder()
                .id(1L)
                .title("Học Spring Boot")
                .description("Lập trình RESTful API")
                .completed(false)
                .priority(Priority.HIGH)
                .dueDate(LocalDateTime.of(2026, 8, 1, 10, 0))
                .build();

        sampleRequest = TodoRequest.builder()
                .title("Học Spring Boot")
                .description("Lập trình RESTful API")
                .completed(false)
                .priority(Priority.HIGH)
                .dueDate(LocalDateTime.of(2026, 8, 1, 10, 0))
                .build();
    }

    @Test
    void testCreateTodo_Success() {
        when(todoRepository.save(any(Todo.class))).thenReturn(sampleTodo);

        TodoResponse response = todoService.createTodo(sampleRequest);

        assertNotNull(response);
        assertEquals(sampleTodo.getId(), response.getId());
        assertEquals(sampleTodo.getTitle(), response.getTitle());
        assertEquals(sampleTodo.getPriority(), response.getPriority());
        verify(todoRepository, times(1)).save(any(Todo.class));
    }

    @Test
    void testGetTodoById_Success() {
        when(todoRepository.findById(1L)).thenReturn(Optional.of(sampleTodo));

        TodoResponse response = todoService.getTodoById(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Học Spring Boot", response.getTitle());
        verify(todoRepository, times(1)).findById(1L);
    }

    @Test
    void testGetTodoById_NotFound_ThrowsException() {
        when(todoRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> todoService.getTodoById(99L));
        verify(todoRepository, times(1)).findById(99L);
    }

    @Test
    void testToggleTodo_Success() {
        boolean initialStatus = sampleTodo.isCompleted();
        when(todoRepository.findById(1L)).thenReturn(Optional.of(sampleTodo));
        when(todoRepository.save(any(Todo.class))).thenAnswer(invocation -> invocation.getArgument(0));

        TodoResponse response = todoService.toggleTodo(1L);

        assertNotNull(response);
        assertEquals(!initialStatus, response.isCompleted());
        verify(todoRepository, times(1)).findById(1L);
        verify(todoRepository, times(1)).save(any(Todo.class));
    }

    @Test
    void testDeleteTodo_Success() {
        when(todoRepository.existsById(1L)).thenReturn(true);
        doNothing().when(todoRepository).deleteById(1L);

        todoService.deleteTodo(1L);

        verify(todoRepository, times(1)).existsById(1L);
        verify(todoRepository, times(1)).deleteById(1L);
    }

    @Test
    void testDeleteTodo_NotFound_ThrowsException() {
        when(todoRepository.existsById(99L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> todoService.deleteTodo(99L));
        verify(todoRepository, times(1)).existsById(99L);
        verify(todoRepository, never()).deleteById(anyLong());
    }
}
