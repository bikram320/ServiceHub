package org.example.servicehub.Model;

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
public class Admin {
    @Id
    @ColumnDefault("1")
    @Column(name = "admin_id", nullable = false)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "password", nullable = false)
    private String password;

    @ColumnDefault("'ADMIN'")
    @Column(name = "role", nullable = false, length = 50)
    private String role;

    @OneToMany(mappedBy = "admin")
    private Set<AdminAction> adminactions = new LinkedHashSet<>();

}