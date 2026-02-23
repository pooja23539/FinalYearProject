package com.digitalattendence.digitalattendencesystem.model;

import jakarta.persistence.*;

@Entity
@Table(name = "semester")
public class Semester {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer number;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getNumber() { return number; }
    public void setNumber(Integer number) { this.number = number; }
}

