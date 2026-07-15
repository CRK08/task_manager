package com.example.taskmanager.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.taskmanager.dto.DashboardResponse;
import com.example.taskmanager.service.TaskService;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    private final TaskService taskService;

    public DashboardController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboardMetrics() {
        return ResponseEntity.ok(taskService.getDashboardMetrics());
    }
}
