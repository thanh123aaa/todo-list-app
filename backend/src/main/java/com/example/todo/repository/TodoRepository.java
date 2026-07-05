package com.example.todo.repository;

import com.example.todo.model.Priority;
import com.example.todo.model.Todo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {

    @Query("SELECT t FROM Todo t WHERE " +
           "(:search IS NULL OR TRIM(:search) = '' OR LOWER(t.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:completed IS NULL OR t.completed = :completed) AND " +
           "(:priority IS NULL OR t.priority = :priority)")
    Page<Todo> findWithFilters(
            @Param("search") String search,
            @Param("completed") Boolean completed,
            @Param("priority") Priority priority,
            Pageable pageable
    );
}
