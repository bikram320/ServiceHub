package org.example.QuestX.services.UserDetailsService;

import lombok.AllArgsConstructor;
import org.example.QuestX.Model.Technician;
import org.example.QuestX.Repository.TechnicianRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class TechnicianDetailsService  implements UserDetailsService {

    private final TechnicianRepository technicianRepository;


    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Technician tech =technicianRepository.findByEmail(email);
        if(tech == null) {
            throw new UsernameNotFoundException(email);
        }
        return new org.springframework.security.core.userdetails.User(
                tech.getEmail(),
                tech.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + tech.getRole()))
        );
    }
}
