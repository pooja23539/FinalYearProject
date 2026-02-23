package com.digitalattendence.digitalattendencesystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.digitalattendence.digitalattendencesystem.model.Semester;

public interface SemesterRepository extends JpaRepository<Semester, Integer> {
}
