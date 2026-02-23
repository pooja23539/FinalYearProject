package com.digitalattendence.digitalattendencesystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.digitalattendence.digitalattendencesystem.model.Student;

import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Long> {
    List<Student> findByProgramIdAndSemesterId(Long programId, Long semesterId);
}

