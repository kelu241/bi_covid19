package com.luciano.gestao.MetodoExtensao;
import com.luciano.gestao.DTO.CasosCovidDTO;
import com.luciano.gestao.model.CasosCovid;

public  class CasosCovidExtensao {

    public static CasosCovid DTOtoCasosCovid(CasosCovidDTO dto) {
        return new CasosCovid(dto.id(), dto.datakey(), dto.localizacaokey(), dto.confirmados(), dto.confirmadosPor100k(), dto.mortes(), dto.taxaMorte(), dto.isLast(), dto.ordemLocal(), dto.dataCarregamento());
    }   



    public static CasosCovidDTO CasosCovidToDTO(CasosCovid casos) {
        return new CasosCovidDTO(casos.getId(), casos.getDateKey(), casos.getLocationKey(), casos.getConfirmed(), casos.getConfirmedPer100kInhabitants(), casos.getDeaths(), casos.getDeathRate(), casos.getIsLast(), casos.getOrderForPlace(), casos.getLoadDttm());
    }




    }
