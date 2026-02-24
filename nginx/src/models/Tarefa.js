
export const CreateCasosCovidDTO = (dados ={}) => ({

  id:dados.id || '',
 
  DateKey:dados.DateKey || '',
 
  LocationKey:dados.LocationKey || '',
 
  Confirmed:dados.Confirmed || '',
 
  ConfirmedPer100kInhabitants:dados.ConfirmedPer100kInhabitants || '',
 
  Deaths:dados.Deaths  || '',
 
  DeathRate:dados.DeathRate || '',
 
  IsLast:dados.IsLast || '',
 
  OrderForPlace:dados.OrderForPlace || '',
 
  DateLoadDttm:dados.DateLoadDttm || '',
});

