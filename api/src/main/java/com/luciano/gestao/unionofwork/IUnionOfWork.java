package com.luciano.gestao.unionofwork;

import com.luciano.gestao.repository.ICasosCovidRepository;

public interface IUnionOfWork {
    ICasosCovidRepository getCasosCovidRepository();
    
}
