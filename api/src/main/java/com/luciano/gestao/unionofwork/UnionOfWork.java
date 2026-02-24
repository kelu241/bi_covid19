package com.luciano.gestao.unionofwork;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.luciano.gestao.repository.CasosCovidRepository;
import com.luciano.gestao.repository.ICasosCovidRepository;

@Repository

public class UnionOfWork implements IUnionOfWork {
    @Autowired
    private ICasosCovidRepository _CasosCovidRepository;

    @Override
    public ICasosCovidRepository getCasosCovidRepository() {
        // TODO Auto-generated method stub
        return (_CasosCovidRepository != null)?_CasosCovidRepository:new CasosCovidRepository();
    }

}
