package com.example.taskmanager.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.taskmanager.dto.DashboardResponse;
import com.example.taskmanager.entity.Task;
import com.example.taskmanager.entity.User;
import com.example.taskmanager.enums.Priority;
import com.example.taskmanager.enums.Status;
import com.example.taskmanager.exception.ResourceNotFoundException;
import com.example.taskmanager.repository.TaskRepository;
import com.example.taskmanager.repository.UserRepository;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Authenticated user not found: " + email));
    }

    public Page<Task> getAllTasks(Pageable pageable) {
        return taskRepository.findByUserAndDeletedFalse(getAuthenticatedUser(), pageable);
    }

    public Task createTask(Task task) {
        task.setUser(getAuthenticatedUser());
        task.setDeleted(false);
        task.setArchived(false);
        return taskRepository.save(task);
    }

    public List<Task> getAllTasks() {
        return taskRepository.findByUserAndDeletedFalse(getAuthenticatedUser());
    }

    public Task getTaskById(Long id) {
        return taskRepository.findByIdAndUserAndDeletedFalse(id, getAuthenticatedUser())
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id " + id));
    }

    public Task updateTask(Long id, Task updatedTask) {
        Task task = getTaskById(id);

        task.setTitle(updatedTask.getTitle());
        task.setDescription(updatedTask.getDescription());
        task.setStatus(updatedTask.getStatus());
        task.setPriority(updatedTask.getPriority());
        task.setDueDate(updatedTask.getDueDate());

        return taskRepository.save(task);
    }

    public void deleteTask(Long id) {
        Task task = getTaskById(id);
        task.setDeleted(true);
        taskRepository.save(task);
    }

    public List<Task> searchTasks(String query) {
        return taskRepository.searchTasks(getAuthenticatedUser(), query);
    }

    public List<Task> getByStatus(Status status) {
        return taskRepository.findByUserAndStatusAndDeletedFalse(getAuthenticatedUser(), status);
    }

    public List<Task> getByPriority(Priority priority) {
        return taskRepository.findByUserAndPriorityAndDeletedFalse(getAuthenticatedUser(), priority);
    }

    public List<Task> getDueToday() {
        return taskRepository.findByUserAndDueDateAndDeletedFalse(getAuthenticatedUser(), LocalDate.now());
    }

    public List<Task> getOverdue() {
        return taskRepository.findByUserAndDueDateBeforeAndStatusNotAndDeletedFalse(
                getAuthenticatedUser(), LocalDate.now(), Status.COMPLETED);
    }

    public Task archiveTask(Long id) {
        Task task = getTaskById(id);
        task.setArchived(true);
        return taskRepository.save(task);
    }

    public Task restoreTask(Long id) {
        // Find task (must be owned by user and not deleted, even if archived)
        Task task = getTaskById(id);
        task.setArchived(false);
        return taskRepository.save(task);
    }

    public DashboardResponse getDashboardMetrics() {
        User user = getAuthenticatedUser();
        List<Task> tasks = taskRepository.findByUserAndDeletedFalse(user);
        long total = tasks.size();
        long pending = tasks.stream().filter(t -> t.getStatus() == Status.PENDING).count();
        long inProgress = tasks.stream().filter(t -> t.getStatus() == Status.IN_PROGRESS).count();
        long completed = tasks.stream().filter(t -> t.getStatus() == Status.COMPLETED).count();
        long highPriority = tasks.stream().filter(t -> t.getPriority() == Priority.HIGH).count();
        
        LocalDate today = LocalDate.now();
        long overdue = tasks.stream().filter(t -> t.getDueDate() != null && t.getDueDate().isBefore(today) && t.getStatus() != Status.COMPLETED).count();

        return new DashboardResponse(total, pending, completed, inProgress, highPriority, overdue);
    }
}
