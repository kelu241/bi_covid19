package com.luciano.gestao.DTO;
import java.math.BigInteger;
import java.sql.Date;



public record CasosCovidDTO(BigInteger id, Integer datakey, Integer localizacaokey, Integer confirmados, Double confirmadosPor100k, Integer mortes, Double taxaMorte, Boolean isLast, Integer ordemLocal, Date dataCarregamento) {
} 






