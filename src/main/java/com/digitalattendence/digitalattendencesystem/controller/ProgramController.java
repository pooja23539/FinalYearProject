package com.digitalattendence.digitalattendencesystem.controller;

import com.digitalattendence.digitalattendencesystem.model.Program;
import com.digitalattendence.digitalattendencesystem.repository.ProgramRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/program")
public class ProgramController {

    @Autowired
    private ProgramRepository programRepository;

    @PostMapping
    public ResponseEntity<Program> createProgram(@RequestBody Program program) {
        Program savedProgram = programRepository.save(program);
        return ResponseEntity.ok(savedProgram);
    }
    @GetMapping
    public ResponseEntity<List<Program>> getAllPrograms() {
        List<Program> programs = programRepository.findAll();
        return ResponseEntity.ok(programs);
    }
}

