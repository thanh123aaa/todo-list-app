package com.example.todo.service;

import com.example.todo.dto.TodoRequest;
import com.example.todo.dto.TodoResponse;
import com.example.todo.exception.ResourceNotFoundException;
import com.example.todo.model.Priority;
import com.example.todo.model.Todo;
import com.example.todo.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TodoServiceImpl implements TodoService {

    private final TodoRepository todoRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<TodoResponse> getTodos(String search, Boolean completed, Priority priority, int page, int size, String sortBy, String direction) {
        Sort.Direction sortDirection = Sort.Direction.DESC;
        try {
            sortDirection = Sort.Direction.fromString(direction);
        } catch (IllegalArgumentException e) {
            // Default to DESC if invalid direction is passed
        }
        
        Sort sort = Sort.by(sortDirection, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Todo> todoPage = todoRepository.findWithFilters(search, completed, priority, pageable);
        return todoPage.map(this::convertToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public TodoResponse getTodoById(Long id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy công việc với mã ID: " + id));
        return convertToResponse(todo);
    }

    @Override
    @Transactional
    public TodoResponse createTodo(TodoRequest request) {
        Todo todo = Todo.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .completed(request.isCompleted())
                .priority(request.getPriority() != null ? request.getPriority() : Priority.MEDIUM)
                .dueDate(request.getDueDate())
                .build();
                
        Todo savedTodo = todoRepository.save(todo);
        return convertToResponse(savedTodo);
    }

    @Override
    @Transactional
    public TodoResponse updateTodo(Long id, TodoRequest request) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy công việc để cập nhật với mã ID: " + id));
                
        todo.setTitle(request.getTitle());
        todo.setDescription(request.getDescription());
        todo.setCompleted(request.isCompleted());
        todo.setPriority(request.getPriority() != null ? request.getPriority() : Priority.MEDIUM);
        todo.setDueDate(request.getDueDate());
        
        Todo updatedTodo = todoRepository.save(todo);
        return convertToResponse(updatedTodo);
    }

    @Override
    @Transactional
    public TodoResponse toggleTodo(Long id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy công việc để chuyển đổi trạng thái với mã ID: " + id));
                
        todo.setCompleted(!todo.isCompleted());
        Todo updatedTodo = todoRepository.save(todo);
        return convertToResponse(updatedTodo);
    }

    @Override
    @Transactional
    public void deleteTodo(Long id) {
        if (!todoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Không tìm thấy công việc để xóa với mã ID: " + id);
        }
        todoRepository.deleteById(id);
    }

    private TodoResponse convertToResponse(Todo todo) {
        return TodoResponse.builder()
                .id(todo.getId())
                .title(todo.getTitle())
                .description(todo.getDescription())
                .completed(todo.isCompleted())
                .priority(todo.getPriority())
                .dueDate(todo.getDueDate())
                .createdAt(todo.getCreatedAt())
                .updatedAt(todo.getUpdatedAt())
                .build();
    }
}
