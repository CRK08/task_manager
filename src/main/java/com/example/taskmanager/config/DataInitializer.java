package com.example.taskmanager.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.taskmanager.entity.Category;
import com.example.taskmanager.entity.Label;
import com.example.taskmanager.repository.CategoryRepository;
import com.example.taskmanager.repository.LabelRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final LabelRepository labelRepository;

    public DataInitializer(CategoryRepository categoryRepository, LabelRepository labelRepository) {
        this.categoryRepository = categoryRepository;
        this.labelRepository = labelRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Seed default categories
        List<String> defaultCategories = List.of("Work", "Personal", "Study", "Shopping", "Health");
        for (String catName : defaultCategories) {
            if (categoryRepository.findByName(catName).isEmpty()) {
                categoryRepository.save(new Category(catName));
            }
        }

        // Seed default labels
        List<String> defaultLabels = List.of("Java", "Spring", "Exam", "Office", "College");
        for (String labelName : defaultLabels) {
            if (labelRepository.findByName(labelName).isEmpty()) {
                labelRepository.save(new Label(labelName));
            }
        }
    }
}
