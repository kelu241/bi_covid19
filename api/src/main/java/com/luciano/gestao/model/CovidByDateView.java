package com.luciano.gestao.model;

import java.sql.Date;

public interface CovidByDateView {

    Integer getDateKey();

    Date getDate();

    Integer getLocationKey();

    String getPlaceType();

    String getStateCode();

    String getCityName();

    Integer getConfirmed();

    Integer getDeaths();

    Boolean getIsLast();
}
