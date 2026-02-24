package com.luciano.gestao.controller;

import com.luciano.gestao.model.CasosCovid;
import com.luciano.gestao.model.CovidByDateView;
import com.luciano.gestao.model.CovidEvolutionView;
import com.luciano.gestao.model.CovidTotalsView;
import com.luciano.gestao.model.TopDeathCityView;
import com.luciano.gestao.pagination.PagedList;
import com.luciano.gestao.DTO.CasosCovidDTO;
import com.luciano.gestao.MetodoExtensao.CasosCovidExtensao;
import com.luciano.gestao.logging.LogExecution;
import com.luciano.gestao.logging.CustomLogger;

import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.math.BigInteger;
import java.time.LocalDate;
import java.util.concurrent.CompletableFuture;
import java.util.function.Predicate;
import java.util.stream.StreamSupport;

import com.luciano.gestao.unionofwork.IUnionOfWork;

import com.luciano.gestao.usecases.ICasosCovidService;

@RestController
@RequestMapping("/casos")
@LogExecution(includeParameters = true, includeResult = false) // Log automático para toda a classe
@PreAuthorize("hasRole('USER')")
public class CasosCovidController {
    @Autowired
    private IUnionOfWork unionofwork;

    @Autowired
    private ICasosCovidService casosCovidService;

    @GetMapping
    @LogExecution(includeParameters = false, includeResult = true) // Log específico para este método
    public CompletableFuture<ResponseEntity<Iterable<CasosCovidDTO>>> getAllCasosCovidsAsync() {
        CustomLogger.logInfo("Iniciando busca de todos os CasosCovids");

        var CasosCovidsFuture = unionofwork.getCasosCovidRepository().findAllAsync()
                .thenApply(CasosCovids -> {
                    long count = StreamSupport.stream(CasosCovids.spliterator(), false).count();
                    CustomLogger.logInfo("Convertendo %d CasosCovids para DTO", count);

                    return StreamSupport.stream(CasosCovids.spliterator(), false)
                            .map(CasosCovid -> CasosCovidExtensao.CasosCovidToDTO(CasosCovid))
                            .collect(Collectors.toList());
                }).exceptionally(ex -> {
                    CustomLogger.logError("Erro ao buscar CasosCovids: %s", ex.getMessage());
                    return null;
                });
        return CasosCovidsFuture.thenApply(ResponseEntity::ok);
    }

    @GetMapping("/{id}")
    public CompletableFuture<ResponseEntity<CasosCovidDTO>> getCasosCovidByIdAsync(@PathVariable BigInteger id) {
        return unionofwork.getCasosCovidRepository().findByIdAsync(id)
                .thenApply(CasosCovid -> CasosCovidExtensao.CasosCovidToDTO(CasosCovid))
                .thenApply(ResponseEntity::ok);
    }

    @PostMapping
    public CompletableFuture<ResponseEntity<CasosCovidDTO>> addCasosCovidAsync(
            @RequestBody CasosCovidDTO CasosCovidDTO) {
        CasosCovid CasosCovid = CasosCovidExtensao.DTOtoCasosCovid(CasosCovidDTO);
        return unionofwork.getCasosCovidRepository().saveAsync(CasosCovid)
                .thenApply(CasosCovidSalvo -> CasosCovidExtensao.CasosCovidToDTO(CasosCovidSalvo))
                .thenApply(ResponseEntity::ok);
    }

    @PutMapping("/{id}")
    public CompletableFuture<ResponseEntity<CasosCovidDTO>> updateCasosCovidAsync(@PathVariable BigInteger id,
            @RequestBody CasosCovidDTO CasosCovidDTO) {
        CasosCovid CasosCovid = CasosCovidExtensao.DTOtoCasosCovid(CasosCovidDTO);
        CasosCovid.setId(id != null ? id : CasosCovid.getId());
        return unionofwork.getCasosCovidRepository().saveAsync(CasosCovid)
                .thenApply(CasosCovidAtualizado -> CasosCovidExtensao.CasosCovidToDTO(CasosCovidAtualizado))
                .thenApply(ResponseEntity::ok);
    }

    @DeleteMapping("/{id}")
    public CompletableFuture<ResponseEntity<Void>> deleteCasosCovidAsync(@PathVariable BigInteger id) {
        return unionofwork.getCasosCovidRepository().deleteByIdAsync(id)
                .thenApply(deleted -> ResponseEntity.noContent().build());
    }

    @GetMapping("/pagination")
    public CompletableFuture<ResponseEntity<PagedList<CasosCovidDTO>>> paginateCasosCovidsAsync(
            @RequestParam int pageNumber,
            @RequestParam int pageSize) {

        var pagedList = unionofwork.getCasosCovidRepository().paginateAsync(pageNumber, pageSize);
        return pagedList.thenApply(list -> {
            var dtoList = list.stream()
                    .map(CasosCovidExtensao::CasosCovidToDTO)
                    .collect(Collectors.toList());
            return new PagedList<CasosCovidDTO>(dtoList, list.getCurrentPage(), list.getPageSize(), pageSize);
        }).thenApply(ResponseEntity::ok);
    }

    @GetMapping("/filter")
    public CompletableFuture<ResponseEntity<Iterable<CasosCovidDTO>>> searchCasosCovidsAsync(
            @RequestParam String campo, // nome, descricao, etc.
            @RequestParam String valor) { // texto a buscar

        // Criar predicate baseado nos parâmetros
        Predicate<CasosCovid> predicate = CasosCovid -> {
            switch (campo.toLowerCase()) {
                case "datekey":
                    return String.valueOf(CasosCovid.getDateKey()).equals(valor);
                case "locationkey":
                    return String.valueOf(CasosCovid.getLocationKey()).equals(valor);
                case "confirmados":
                    return String.valueOf(CasosCovid.getConfirmed()).equals(valor);
                case "confirmadospor100k":
                    return String.valueOf(CasosCovid.getConfirmedPer100kInhabitants()).equals(valor);
                case "mortes":
                    return String.valueOf(CasosCovid.getDeaths()).equals(valor);
                case "taxamorte":
                    return String.valueOf(CasosCovid.getDeathRate()).equals(valor);
                case "islast":
                    return String.valueOf(CasosCovid.getIsLast()).equalsIgnoreCase(valor);
                case "ordemlocal":
                    return String.valueOf(CasosCovid.getOrderForPlace()).equals(valor);
                case "datacarregamento":
                    return CasosCovid.getLoadDttm() != null && CasosCovid.getLoadDttm().toString().equals(valor);

                default:
                    return String.valueOf(CasosCovid.getLocationKey()).equals(valor);
            }
        };

        var CasosCovids = unionofwork.getCasosCovidRepository().searchAsync(predicate);
        return CasosCovids.thenApply(list -> StreamSupport.stream(list.spliterator(), false)
                .map(CasosCovidExtensao::CasosCovidToDTO)
                .collect(Collectors.toList())).thenApply(ResponseEntity::ok);
    }

    @GetMapping("/evolucao")
    public CompletableFuture<ResponseEntity<Iterable<CovidEvolutionView>>> getCasosCovidsEvolucao(@RequestParam String data) {

        LocalDate localDate = LocalDate.parse(data);
        return casosCovidService.casosCovidEvolucao(localDate);

    }

    @GetMapping("/totais")
    public CompletableFuture<ResponseEntity<Iterable<CovidTotalsView>>> getCasosCovidsTotais(@RequestParam String data) {
        LocalDate localDate = LocalDate.parse(data);
        return casosCovidService.casosCovidTotais(localDate);
    }

    @GetMapping("/confirmados")
    public CompletableFuture<ResponseEntity<Iterable<CovidByDateView>>> getCasosCovidsConfirmados(
            @RequestParam String data) {
        LocalDate localDate = LocalDate.parse(data);
        return casosCovidService.casosCovidConfirmados(localDate);
    }

    @GetMapping("/mortalidade")
    public CompletableFuture<ResponseEntity<Iterable<TopDeathCityView>>> getCasosCovidsMortalidade(
            @RequestParam String data) {
        LocalDate localDate = LocalDate.parse(data);
        return casosCovidService.mortalidadeCovid(localDate);
    }
}