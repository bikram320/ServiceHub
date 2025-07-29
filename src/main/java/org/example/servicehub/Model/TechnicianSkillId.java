package org.example.servicehub.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@Embeddable
public class TechnicianSkillId implements Serializable {

    private static final long serialVersionUID = -1931403566476919784L;
    @Column(name = "tech_id", nullable = false)
    private Long techId;

    @Column(name = "skill_id", nullable = false)
    private Long skillId;


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        TechnicianSkillId entity = (TechnicianSkillId) o;
        return Objects.equals(this.skillId, entity.skillId) &&
                Objects.equals(this.techId, entity.techId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(skillId, techId);
    }

}