package com.luciano.gestao.repository;


import java.math.BigInteger;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.luciano.gestao.model.CasosCovid;
import com.luciano.gestao.model.CovidByDateView;
import com.luciano.gestao.model.CovidEvolutionView;
import com.luciano.gestao.model.CovidTotalsView;
import com.luciano.gestao.model.TopDeathCityView;



@Repository
public class CasosCovidRepository extends GenericRepository<CasosCovid> implements ICasosCovidRepository {

    @Autowired
    private CasosCovidJpaRepository casosCovidJpaRepository;

    @Override
    protected JpaRepository<CasosCovid, BigInteger> getRepository() {
        return casosCovidJpaRepository;
    }

    @Override
    public List<CovidEvolutionView> evolucaoCasos(LocalDate data) {
        return casosCovidJpaRepository.evolucaoCasos(data);
    }

    @Override
    public List<CovidTotalsView> totaisCasos(LocalDate data) {
        return casosCovidJpaRepository.totaisCasos(data);
    }

    @Override
    public List<CovidByDateView> casosCovid(LocalDate data) {
        return casosCovidJpaRepository.casosCovid(data);
    }

    @Override
    public List<TopDeathCityView> mortalidadeCovid(LocalDate data) {
        return casosCovidJpaRepository.mortalidadeCovid(data);
    }

    

}

