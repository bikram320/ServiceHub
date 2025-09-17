package org.example.QuestX.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "admins", schema = "servicehub")
public class Admin implements JwtUser {
    @Id
    @ColumnDefault("1")
    @Column(name = "admin_id", nullable = false)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "email" , nullable = false)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "role")
    @Enumerated(EnumType.STRING)
    private Role role;

    @Override
    public String getRole() {
        return this.role.name();
    }

    @OneToMany(mappedBy = "admin")
    private Set<AdminAction> adminActions = new LinkedHashSet<>();

}