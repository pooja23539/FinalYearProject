package com.digitalattendence.digitalattendencesystem.controller;

import com.digitalattendence.digitalattendencesystem.model.*;
import com.digitalattendence.digitalattendencesystem.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/course-allocations")
public class CourseAllocationController {

    @Autowired
    private CourseAllocationRepository courseAllocationRepository;

    @Autowired
    private FacultyRepository facultyRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private SemesterRepository semesterRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    // GET all allocations
    @GetMapping
    public List<CourseAllocation> getAll() {
        return courseAllocationRepository.findAll();
    }

    // GET allocation by ID
    @GetMapping("/{id}")
    public ResponseEntity<CourseAllocation> getById(@PathVariable Long id) {
        return courseAllocationRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    // CREATE new allocation
    @PostMapping
    public ResponseEntity<CourseAllocation> create(@RequestBody CourseAllocation allocation) {

        // Fetch and set Faculty by ID
        if (allocation.getFaculty() != null && allocation.getFaculty().getId() != null) {
            allocation.setFaculty(
                    facultyRepository.findById(allocation.getFaculty().getId()).orElse(null)
            );
        }

        // Fetch and set Subject by ID
        if (allocation.getSubject() != null && allocation.getSubject().getId() != null) {
            allocation.setSubject(
                    subjectRepository.findById(allocation.getSubject().getId()).orElse(null)
            );
        }

        // Fetch and set Semester by ID
        if (allocation.getSemester() != null && allocation.getSemester().getId() != null) {
            allocation.setSemester(
                    semesterRepository.findById(allocation.getSemester().getId()).orElse(null)
            );
        }

        // Fetch and set Teacher by ID
        if (allocation.getTeacher() != null && allocation.getTeacher().getId() != null) {
            allocation.setTeacher(
                    teacherRepository.findById(allocation.getTeacher().getId()).orElse(null)
            );
        }

        // Save the allocation and return
        return ResponseEntity.ok(courseAllocationRepository.save(allocation));
    }

    // UPDATE allocation
    @PutMapping("/{id}")
    public ResponseEntity<CourseAllocation> update(@PathVariable Long id, @RequestBody CourseAllocation allocationDetails) {
        return courseAllocationRepository.findById(id).map(allocation -> {

            if (allocationDetails.getFaculty() != null && allocationDetails.getFaculty().getId() != null) {
                allocation.setFaculty(facultyRepository.findById(allocationDetails.getFaculty().getId()).orElse(null));
            }

            if (allocationDetails.getSubject() != null && allocationDetails.getSubject().getId() != null) {
                allocation.setSubject(subjectRepository.findById(allocationDetails.getSubject().getId()).orElse(null));
            }

            if (allocationDetails.getSemester() != null && allocationDetails.getSemester().getId() != null) {
                allocation.setSemester(semesterRepository.findById(allocationDetails.getSemester().getId()).orElse(null));
            }

            if (allocationDetails.getTeacher() != null && allocationDetails.getTeacher().getId() != null) {
                allocation.setTeacher(teacherRepository.findById(allocationDetails.getTeacher().getId()).orElse(null));
            }

            return ResponseEntity.ok(courseAllocationRepository.save(allocation));
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE allocation
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return courseAllocationRepository.findById(id).map(allocation -> {
            courseAllocationRepository.delete(allocation);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
