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

import com.portfolio.backend.model.Estudio;
import com.portfolio.backend.service.EstudioService;

@RestController
@RequestMapping("/api/v1/estudios")
@CrossOrigin(origins = {"http://localhost:5173", "https://portfolio-fullstack-alpha-rouge.vercel.app"})
public class EstudioController {

    @Autowired
    private EstudioService estudioService; // <-- Inyectamos el Service

    @GetMapping
    public List<Estudio> getAllEstudios() {
        return estudioService.obtenerTodos();
    }

    @PostMapping
    public Estudio saveEstudio(@RequestBody Estudio estudio) {
        return estudioService.guardarEstudio(estudio);
    }

    @DeleteMapping("/{id}")
    public void deleteEstudio(@PathVariable Long id) {
        estudioService.eliminarEstudio(id);
    }
}