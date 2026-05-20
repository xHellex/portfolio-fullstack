package com.portfolio.backend.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // Auto-genera Getters, Setters y toString
@NoArgsConstructor // Auto-genera el constructor vacío (Obligatorio para JPA)
@AllArgsConstructor // Auto-genera el constructor con todos los campos
@Entity
@Table(name = "estudios")
public class Estudio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String institucion;

    @Column(nullable = false)
    private String titulo;

    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    
    @Column(length = 1000)
    private String descripcion;

    private boolean actual;
}