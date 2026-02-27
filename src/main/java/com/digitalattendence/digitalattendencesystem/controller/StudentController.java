package com.digitalattendence.digitalattendencesystem.controller;

import com.digitalattendence.digitalattendencesystem.dto.StudentDTO;
import com.digitalattendence.digitalattendencesystem.model.*;
import com.digitalattendence.digitalattendencesystem.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProgramRepository programRepository;

    @Autowired
    private SemesterRepository semesterRepository;

    // ✅ CREATE STUDENT
    @PostMapping
    public ResponseEntity<Student> createStudent(@RequestBody StudentDTO dto) {

        if (dto.getUserId() == null ||
                dto.getProgramId() == null ||
                dto.getSemesterId() == null) {

            return ResponseEntity.badRequest()
                    .body(null);
        }

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Program program = programRepository.findById(dto.getProgramId())
                .orElseThrow(() -> new RuntimeException("Program not found"));

        Semester semester = semesterRepository.findById(dto.getSemesterId())
                .orElseThrow(() -> new RuntimeException("Semester not found"));

        Student student = new Student();
        student.setName(dto.getName());
        student.setRollNo(dto.getRollNo());
        student.setContact(dto.getContact());
        student.setAddress(dto.getAddress());
        student.setStatus(dto.getStatus());
        student.setUser(user);
        student.setProgram(program);
        student.setSemester(semester);

        return ResponseEntity.ok(studentRepository.save(student));
    }
    // ✅ GET ALL STUDENTS
    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(studentRepository.findAll());
    }

    // ✅ GET BY PROGRAM + SEMESTER
    @GetMapping("/by-program-semester")
    public ResponseEntity<List<Student>> getStudentsByProgramAndSemester(
            @RequestParam Long programId,
            @RequestParam Long semesterId) {

        return ResponseEntity.ok(
                studentRepository.findByProgramIdAndSemesterId(programId, semesterId)
        );
    }

    // ✅ UPDATE STUDENT
    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(
            @PathVariable Long id,
            @RequestBody StudentDTO dto) {

        return studentRepository.findById(id).map(student -> {

            student.setName(dto.getName());
            student.setRollNo(dto.getRollNo());
            student.setContact(dto.getContact());
            student.setAddress(dto.getAddress());
            student.setStatus(dto.getStatus());

            student.setProgram(
                    programRepository.findById(dto.getProgramId()).orElse(student.getProgram())
            );
            student.setSemester(
                    semesterRepository.findById(dto.getSemesterId()).orElse(student.getSemester())
            );

            return ResponseEntity.ok(studentRepository.save(student));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ✅ SOFT DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Student> softDeleteStudent(@PathVariable Long id) {
        return studentRepository.findById(id).map(student -> {
            student.setStatus(0);
            return ResponseEntity.ok(studentRepository.save(student));
        }).orElse(ResponseEntity.notFound().build());
    }
}
