package com.portfolio.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.portfolio.backend.model.Tecnologia;
import com.portfolio.backend.service.TecnologiaService;

import lombok.RequiredArgsConstructor;
@RestController
@RequestMapping("/api/v1/tecnologias")
@CrossOrigin(origins = {"http://localhost:5173", "https://portfolio-fullstack-alpha-rouge.vercel.app"})
@RequiredArgsConstructor
public class TecnologiaController {

    private final TecnologiaService tecnologiaService;

    @GetMapping
    public ResponseEntity<List<Tecnologia>> listarTodas() {
        return new ResponseEntity<>(tecnologiaService.obtenerTodas(), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Tecnologia> crearTecnologia(@RequestBody Tecnologia tecnologia) {
        return new ResponseEntity<>(tecnologiaService.guardarTecnologia(tecnologia), HttpStatus.CREATED);
    }
}