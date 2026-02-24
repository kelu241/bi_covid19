package com.luciano.gestao.model;

import java.sql.Date;

public interface CovidEvolutionView {

    Date getDate();

    String getStateCode();

    String getCityName();

    Integer getConfirmed();

    Integer getDeaths();
}
