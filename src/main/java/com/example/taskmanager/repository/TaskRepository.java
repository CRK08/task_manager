package com.example.taskmanager.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.taskmanager.entity.Task;
import com.example.taskmanager.entity.User;
import com.example.taskmanager.enums.Priority;
import com.example.taskmanager.enums.Status;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    Page<Task> findByUserAndDeletedFalse(User user, Pageable pageable);

    List<Task> findByUserAndDeletedFalse(User user);

    Optional<Task> findByIdAndUserAndDeletedFalse(Long id, User user);

    List<Task> findByUserAndStatusAndDeletedFalse(User user, Status status);

    List<Task> findByUserAndPriorityAndDeletedFalse(User user, Priority priority);

    List<Task> findByUserAndDueDateAndDeletedFalse(User user, LocalDate date);

    List<Task> findByUserAndDueDateBeforeAndStatusNotAndDeletedFalse(User user, LocalDate date, Status status);

    @Query("SELECT t FROM Task t WHERE t.user = :user AND t.deleted = false AND " +
           "(LOWER(t.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(t.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Task> searchTasks(@Param("user") User user, @Param("query") String query);
}