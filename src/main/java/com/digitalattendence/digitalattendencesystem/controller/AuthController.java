package com.digitalattendence.digitalattendencesystem.controller;
import com.digitalattendence.digitalattendencesystem.dto.LoginResponse;
import com.digitalattendence.digitalattendencesystem.repository.UserRepository;
import com.digitalattendence.digitalattendencesystem.service.CustomUserDetailsService;
import com.digitalattendence.digitalattendencesystem.config.JwtUtil;
import com.digitalattendence.digitalattendencesystem.dto.LoginRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;



import java.util.Map;

@RestController
@RequestMapping("/api/auth")
//@CrossOrigin(origins = "http://localhost:3000")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {

        System.out.println(loginRequest.getUsername());
        System.out.println(loginRequest.getPassword());

        try {
            // Authenticate username/password
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid credentials"));
        }

        // Load user details
        final UserDetails userDetails = userDetailsService
                .loadUserByUsername(loginRequest.getUsername());

        // ✅ Check if user is inactive
        if (userDetails instanceof com.digitalattendence.digitalattendencesystem.model.User) {
            com.digitalattendence.digitalattendencesystem.model.User user =
                    (com.digitalattendence.digitalattendencesystem.model.User) userDetails;

            if (!user.getStatus()) {  // if status is false
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "You have been blocked by admin"));
            }
        }

        // Generate JWT token for active users
        final String jwt = jwtUtil.generateToken(userDetails);

        // Fetch user from DB to get the role
        com.digitalattendence.digitalattendencesystem.model.User user =
                userRepository.findByUsername(loginRequest.getUsername()).orElse(null);

        String roleStr = (user != null && user.getRole() != null) ? user.getRole().getCode() : "";

        return ResponseEntity.ok(new LoginResponse(jwt, roleStr, "Login successful"));
    }
}