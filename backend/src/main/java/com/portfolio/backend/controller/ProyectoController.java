package com.portfolio.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.portfolio.backend.model.Proyecto;
import com.portfolio.backend.service.ProyectoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/proyectos")
@CrossOrigin(origins = "*") 
@RequiredArgsConstructor // Inyección por constructor limpia
public class ProyectoController {

    private final ProyectoService proyectoService;

    @GetMapping
    public ResponseEntity<List<Proyecto>> listarTodos() {
        List<Proyecto> proyectos = proyectoService.obtenerTodos();
        return new ResponseEntity<>(proyectos, HttpStatus.OK);
    }

    @GetMapping("/activos")
    public ResponseEntity<List<Proyecto>> listarActivos() {
        List<Proyecto> proyectos = proyectoService.obtenerActivos();
        return new ResponseEntity<>(proyectos, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Proyecto> crearProyecto(@RequestBody Proyecto proyecto) {
        Proyecto nuevoProyecto = proyectoService.guardarProyecto(proyecto);
        return new ResponseEntity<>(nuevoProyecto, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProyecto(@PathVariable Long id) {
        proyectoService.eliminarProyecto(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    
    @PostMapping("/{proyectoId}/tecnologias/{tecnologiaId}")
    public ResponseEntity<Proyecto> asignarTecnologiaAProyecto(
            @PathVariable Long proyectoId, 
            @PathVariable Long tecnologiaId) {
        
        Proyecto proyectoActualizado = proyectoService.asignarTecnologia(proyectoId, tecnologiaId);
        return new ResponseEntity<>(proyectoActualizado, HttpStatus.OK);
    }
}