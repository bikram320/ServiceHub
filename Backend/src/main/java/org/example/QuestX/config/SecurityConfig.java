package org.example.QuestX.config;

import lombok.AllArgsConstructor;
import org.example.QuestX.Model.Role;
import org.example.QuestX.filters.JwtAuthenticationFilter;
import org.example.QuestX.services.UserDetailsService.AdminDetailsService;
import org.example.QuestX.services.UserDetailsService.TechnicianDetailsService;
import org.example.QuestX.services.UserDetailsService.UserDetailsServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.List;


@Configuration
@EnableWebSecurity
@AllArgsConstructor
public class SecurityConfig {

    private final PasswordConfig passwordConfig;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;


    @Bean
    public AuthenticationProvider userAuthenticationProvider(UserDetailsServiceImpl userDetailsService) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setPasswordEncoder(passwordConfig.passwordEncoder());
        provider.setUserDetailsService(userDetailsService);
        return provider;
    }
    @Bean
    public AuthenticationProvider technicianAuthenticationProvider(TechnicianDetailsService technicianDetailsService) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setPasswordEncoder(passwordConfig.passwordEncoder());
        provider.setUserDetailsService(technicianDetailsService);
        return provider;
    }

    @Bean
    public AuthenticationProvider adminAuthenticationProvider(AdminDetailsService adminDetailsService) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setPasswordEncoder(passwordConfig.passwordEncoder());
        provider.setUserDetailsService(adminDetailsService);
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            UserDetailsServiceImpl userDetailsService,
            AdminDetailsService adminDetailsService,
            TechnicianDetailsService technicianDetailsService
    ) {
        return new ProviderManager(
                List.of(
                        userAuthenticationProvider(userDetailsService),
                        adminAuthenticationProvider(adminDetailsService),
                        technicianAuthenticationProvider(technicianDetailsService)
                )
        );
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .sessionManagement(c ->
                        c.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(c -> c
                        //  Public endpoints
                        .requestMatchers(HttpMethod.POST, "/auth/login/**", "/auth/signup/**" , "/auth/logout").permitAll()
                        .requestMatchers("/Home/**").permitAll()
                        .requestMatchers("/payments/esewa/success", "/payments/esewa/failure").permitAll()

                        // User endpoints
                        .requestMatchers("/payments/initiate").hasRole(Role.USER.name())
                        .requestMatchers("/users/**").hasRole(Role.USER.name())

                        // Technician endpoints
                        .requestMatchers("/technicians/**").hasRole(Role.TECHNICIAN.name())

                        // Admin endpoints
                        .requestMatchers("/payments/release/**").hasRole(Role.ADMIN.name())
                        .requestMatchers("/admin/**").hasRole(Role.ADMIN.name())

                        // Everything else
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(c -> {
                    c.authenticationEntryPoint(
                            new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)
                    );
                    c.accessDeniedHandler((request, response, accessDeniedException) ->
                            response.sendError(HttpStatus.FORBIDDEN.value()));
                });

        return http.build();
    }

}
