package com.digitalattendence.digitalattendencesystem.config;

import com.digitalattendence.digitalattendencesystem.model.Role;
import com.digitalattendence.digitalattendencesystem.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(RoleRepository roleRepository) {
        return args -> {
            System.out.println("===== DATA INITIALIZER STARTED =====");
            
            // 1. Log existing roles to verify DB connection and data
            List<Role> existingRoles = roleRepository.findAll();
            System.out.println("Found " + existingRoles.size() + " roles in database:");
            for (Role r : existingRoles) {
                System.out.println(" - ID: " + r.getId() + ", Code: '" + r.getCode() + "', Name: '" + r.getName() + "'");
            }

            // 2. Seed missing roles
            createRoleIfNotFound(roleRepository, "ADM", "Admin");
            createRoleIfNotFound(roleRepository, "TEA", "Teacher");
            createRoleIfNotFound(roleRepository, "STD", "Student");
            
            System.out.println("===== DATA INITIALIZER FINISHED =====");
        };
    }

    private void createRoleIfNotFound(RoleRepository roleRepository, String code, String name) {
        Role role = roleRepository.findByCode(code);
        if (role == null) {
            Role newRole = new Role();
            newRole.setCode(code);
            newRole.setName(name);
            newRole.setStatus("ACTIVE");
            roleRepository.save(newRole);
            System.out.println("SEEDING ROLE: " + code);
        } else {
            System.out.println("FOUND ROLE: " + code);
        }
    }
}
