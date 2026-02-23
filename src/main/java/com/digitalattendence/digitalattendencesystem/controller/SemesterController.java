package com.digitalattendence.digitalattendencesystem.controller;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.digitalattendence.digitalattendencesystem.model.Semester;
import com.digitalattendence.digitalattendencesystem.repository.SemesterRepository;

@RestController
@RequestMapping("/semesters")
public class SemesterController {

    private final SemesterRepository semesterRepository;

    public SemesterController(SemesterRepository semesterRepository) {
        this.semesterRepository = semesterRepository;
    }

    // ➕ Add semester
    @PostMapping
    public Semester save(@RequestBody Semester semester) {
        return semesterRepository.save(semester);
    }

    // 📄 Get all semesters
    @GetMapping
    public List<Semester> getAll() {
        return semesterRepository.findAll();
    }

    // 🔍 Get semester by id
    @GetMapping("/{id}")
    public Semester getById(@PathVariable Integer id) {
        return semesterRepository.findById(id).orElse(null);
    }

    // ❌ Delete semester
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        semesterRepository.deleteById(id);
    }
}
