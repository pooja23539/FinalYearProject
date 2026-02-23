package com.digitalattendence.digitalattendencesystem.controller;

import com.digitalattendence.digitalattendencesystem.repository.AttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
        import java.util.List;

import com.digitalattendence.digitalattendencesystem.model.Attendance;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {


    @Autowired
    private AttendanceRepository repository;  // ✅ Inject repository

    // Get all
    @GetMapping
    public List<Attendance> getAll() {
        return repository.findAll();  // ✅ Works now
    }

    // Create new attendance
    @PostMapping
    public Attendance create(@RequestBody Attendance att) {
        return repository.save(att);  // ✅ Works now
    }
}
