package com.portfolio.backend.model;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "proyectos")
public class Proyecto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String titulo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "url_repo", length = 255)
    private String urlRepo;

    @Column(name = "url_demo", length = 255)
    private String urlDemo;

    @Column(name = "fecha_creacion")
    private LocalDate fechaCreacion;

    @Column(nullable = false)
    private Boolean activo = true;

    @ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
        name = "proyecto_tecnologia",
        joinColumns = @JoinColumn(name = "proyecto_id"),
        inverseJoinColumns = @JoinColumn(name = "tecnologia_id")
    )
    private Set<Tecnologia> tecnologias = new HashSet<>();

    // Constructores
    public Proyecto() {}

    // Métodos Helpers para mantener la sincronización bidireccional
    public void addTecnologia(Tecnologia tecnologia) {
        this.tecnologias.add(tecnologia);
        tecnologia.getProyectos().add(this);
    }

    public void removeTecnologia(Tecnologia tecnologia) {
        this.tecnologias.remove(tecnologia);
        tecnologia.getProyectos().remove(this);
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getUrlRepo() { return urlRepo; }
    public void setUrlRepo(String urlRepo) { this.urlRepo = urlRepo; }

    public String getUrlDemo() { return urlDemo; }
    public void setUrlDemo(String urlDemo) { this.urlDemo = urlDemo; }

    public LocalDate getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDate fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }

    public Set<Tecnologia> getTecnologias() { return tecnologias; }
    public void setTecnologias(Set<Tecnologia> tecnologias) { this.tecnologias = tecnologias; }
}