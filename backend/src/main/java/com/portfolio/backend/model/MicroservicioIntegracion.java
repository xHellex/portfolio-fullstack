package com.portfolio.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "microservicios_integracion")
public class MicroservicioIntegracion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre_servicio", nullable = false, length = 50)
    private String nombreServicio;

    @Column(name = "endpoint_base", nullable = false, length = 255)
    private String endpointBase;

    @Column(length = 20)
    private String estado = "ACTIVE";

    // Constructores
    public MicroservicioIntegracion() {}

    public MicroservicioIntegracion(String nombreServicio, String endpointBase, String estado) {
        this.nombreServicio = nombreServicio;
        this.endpointBase = endpointBase;
        this.estado = estado;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombreServicio() { return nombreServicio; }
    public void setNombreServicio(String nombreServicio) { this.nombreServicio = nombreServicio; }

    public String getEndpointBase() { return endpointBase; }
    public void setEndpointBase(String endpointBase) { this.endpointBase = endpointBase; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}