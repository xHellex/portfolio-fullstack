package com.portfolio.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.portfolio.backend.model.Experiencia;
import com.portfolio.backend.service.ExperienciaService;

@RestController
@RequestMapping("/api/v1/experiencias")
@CrossOrigin(origins = {"http://localhost:5173", "https://portfolio-fullstack-alpha-rouge.vercel.app"})
public class ExperienciaController {

    @Autowired
    private ExperienciaService experienciaService; // <-- Inyectamos el Service

    @GetMapping
    public List<Experiencia> getAllExperiencias() {
        return experienciaService.obtenerTodas();
    }

    @PostMapping
    public Experiencia saveExperiencia(@RequestBody Experiencia experiencia) {
        return experienciaService.guardarExperiencia(experiencia);
    }

    @DeleteMapping("/{id}")
    public void deleteExperiencia(@PathVariable Long id) {
        experienciaService.eliminarExperiencia(id);
    }
}