package com.example.todo.service;

import com.example.todo.dto.TodoRequest;
import com.example.todo.dto.TodoResponse;
import com.example.todo.model.Priority;
import org.springframework.data.domain.Page;

public interface TodoService {
    Page<TodoResponse> getTodos(String search, Boolean completed, Priority priority, int page, int size, String sortBy, String direction);
    TodoResponse getTodoById(Long id);
    TodoResponse createTodo(TodoRequest request);
    TodoResponse updateTodo(Long id, TodoRequest request);
    TodoResponse toggleTodo(Long id);
    void deleteTodo(Long id);
}
