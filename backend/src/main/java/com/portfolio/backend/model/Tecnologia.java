package com.portfolio.backend.model;

import java.util.HashSet; // Importante agregar esta línea
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tecnologias")
@Getter
@Setter
@NoArgsConstructor
public class Tecnologia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String nombre;

    @Column(length = 30)
    private String categoria;

    // Con @JsonIgnore evitamos el bucle infinito al generar el JSON
    @JsonIgnore
    @ManyToMany(mappedBy = "tecnologias", fetch = FetchType.LAZY)
    private Set<Proyecto> proyectos = new HashSet<>();

    public Tecnologia(String nombre, String categoria) {
        this.nombre = nombre;
        this.categoria = categoria;
    }
}