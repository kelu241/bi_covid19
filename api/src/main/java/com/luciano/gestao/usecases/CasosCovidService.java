package com.luciano.gestao.usecases;

import java.util.concurrent.CompletableFuture;
import java.time.LocalDate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.luciano.gestao.model.CovidByDateView;
import com.luciano.gestao.model.CovidEvolutionView;
import com.luciano.gestao.model.CovidTotalsView;
import com.luciano.gestao.model.TopDeathCityView;
import com.luciano.gestao.unionofwork.IUnionOfWork;

@Service
public class CasosCovidService implements ICasosCovidService {

    @Autowired
    private IUnionOfWork unionofwork;

    @Override
    public CompletableFuture<ResponseEntity<Iterable<CovidEvolutionView>>> casosCovidEvolucao(
            LocalDate data) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                var result = unionofwork.getCasosCovidRepository().evolucaoCasos(data);
                return ResponseEntity.ok(result);
            } catch (Exception e) {
                return ResponseEntity.status(500).build();
            }
        });
    }

    @Override
    public CompletableFuture<ResponseEntity<Iterable<CovidTotalsView>>> casosCovidTotais(
            LocalDate data) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                var result = unionofwork.getCasosCovidRepository().totaisCasos(data);
                return ResponseEntity.ok(result);
            } catch (Exception e) {
                return ResponseEntity.status(500).build();
            }
        });     
    }

    @Override
    public CompletableFuture<ResponseEntity<Iterable<CovidByDateView>>> casosCovidConfirmados(
            LocalDate data) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                var result = unionofwork.getCasosCovidRepository().casosCovid(data);
                return ResponseEntity.ok(result);
            } catch (Exception e) {
                return ResponseEntity.status(500).build();  
            }
        });
    }

    @Override
    public CompletableFuture<ResponseEntity<Iterable<TopDeathCityView>>> mortalidadeCovid(
            LocalDate data) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                var result = unionofwork.getCasosCovidRepository().mortalidadeCovid(data);
                return ResponseEntity.ok(result);
            } catch (Exception e) {
                return ResponseEntity.status(500).build();
            }
        });
    }

}