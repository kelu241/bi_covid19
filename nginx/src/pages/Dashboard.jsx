import DataTable from 'react-data-table-component';
import { useState, useEffect, useRef } from 'react';
import { CasosCovidService } from '../services/CasosCovidService'; // ✅ Importa o service atualizado
import TelaPrincipal from '../utils/TelaPrincipal'
import GraficoBarras from './GraficoBarras';

const formatDateBr = (isoDate) => {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  if (!year || !month || !day) return isoDate;
  return `${day}/${month}/${year}`;
};

const formatNumberBr = (value) => {
  if (value === null || value === undefined || Number.isNaN(value)) return '-';
  return new Intl.NumberFormat('pt-BR').format(Number(value));
};
const Dashboard = () => {
  const [loadingDados, setLoadingDados] = useState(false);
  const [loadingEtl, setLoadingEtl] = useState(false);
  const [etlSeconds, setEtlSeconds] = useState(0);
  const etlTimerRef = useRef(null);
  const [apiData, setApiData] = useState([]);
  const [casosEvolucao, setCasosEvolucao] = useState([]);
  const [casosTotais, setCasosTotais] = useState(0);
  const [casosConfirmados, setCasosConfirmados] = useState([]);
  const [mortalidade, setMortalidade] = useState(0);
  
  const[data, setData] = useState('2021-03-01');

  // Debug: Log sempre que apiData muda  
  console.log('🔄 Dashboard re-renderizou. apiData:', apiData ? `${apiData.length} itens` : 'null', 'loadingEtl:', loadingEtl);

  // ✅ useEffect simplificado - sempre busca dados frescos
  useEffect(() => {
    console.log('🚀 useEffect executado - buscando dados frescos');
    setLoadingDados(true);
    let casosCovidLoaded = false;
    let casosEvolucaoLoaded = false;
    let casosTotaisLoaded = false;
    let casosConfirmadosLoaded = false;
    let mortalidadeLoaded = false;

    const checkLoading = () => {
      if (casosCovidLoaded && casosEvolucaoLoaded && casosTotaisLoaded && casosConfirmadosLoaded && mortalidadeLoaded) {
        setLoadingDados(false);
      }
    };


   

    // Criar Observable
    //   const casos = CasosCovidService(
    //   'http://localhost:8080/casos',
    //   'GET',
    //   { 'Content-Type': 'application/json' },
    //   null
    // );

    const casosEvolucaoObs = CasosCovidService(
      '/api/casos/evolucao',
      'GET',
      { 'Content-Type': 'application/json' },
      null, data
    );

    const casosTotaisObs = CasosCovidService(
      '/api/casos/totais',
      'GET',
      { 'Content-Type': 'application/json' },
      null, data
    );

    const casosConfirmadosObs = CasosCovidService(
      '/api/casos/confirmados',
      'GET',
      { 'Content-Type': 'application/json' },
      null, data
    );

    const mortalidadeObs = CasosCovidService(
      '/api/casos/mortalidade',
      'GET',
      { 'Content-Type': 'application/json' },
      null, data
    );



    // Subscribe com referência para cleanup
    // const subscription = casos.subscribe({
    //   next: (data) => {
    //     console.log('🎉 Dados recebidos da API:', data);
    //     console.log('📊 Tipo dos dados:', typeof data);
    //     console.log('📋 É array?', Array.isArray(data));
    //     console.log('📏 Quantidade de itens:', data?.length || 'N/A');

    //     // Atualizar com os dados recebidos
    //     if (data) {
    //       console.log('✅ Atualizando estado com dados frescos');
    //       setApiData(data);
    //       casosCovidLoaded = true;
    //       checkLoading();
    //     } else {
    //       console.log('⚠️ Dados vazios ou nulos');
    //       setApiData([]);
    //     }

    //   },
    //   error: (err) => {
    //     console.error('❌ Erro na API:', err);
    //     console.error('🔍 Status do erro:', err.message);
    //     setApiData([]);
    //     checkLoading();
    //   }
    // });


    const casosEvolucaoSubscription = casosEvolucaoObs.subscribe({
      next: (data) => {
        console.log('🎉 Casos COVID evolução recebidos:', data);
        setCasosEvolucao(data);
        
        casosEvolucaoLoaded = true;
        checkLoading();

      },
      error: (err) => {
        console.error('❌ Erro ao buscar casos COVID evolução:', err);
        checkLoading();
      }
    });

    const totaisSubscription = casosTotaisObs.subscribe({
      next: (data) => {
        console.log('🎉 Casos COVID totais recebidos:', data);
        setCasosTotais(data);
        casosTotaisLoaded = true;
        checkLoading();

      },
      error: (err) => {
        console.error('❌ Erro ao buscar casos COVID totais:', err);
        checkLoading();
      }
    });

    const casosConfirmadosSubscription = casosConfirmadosObs.subscribe({
      next: (data) => {
        console.log('🎉 Casos COVID confirmados recebidos:', data);
        setCasosConfirmados(data);
        casosConfirmadosLoaded = true;
        checkLoading();

      },
      error: (err) => {
        console.error('❌ Erro ao buscar casos COVID confirmados:', err);
        checkLoading();
      }
    });

    const mortalidadeSubscription = mortalidadeObs.subscribe({
      next: (data) => {
        console.log('🎉 Casos COVID mortalidade recebidos:', data);
        setMortalidade(data);
        mortalidadeLoaded = true;
        checkLoading();

      },
      error: (err) => {
        console.error('❌ Erro ao buscar casos COVID mortalidade:', err);
        checkLoading();
      }
    });

    // ✅ CLEANUP - MUITO IMPORTANTE!
    return () => {
      console.log('🧹 Cleanup executado - desmontando componente');
      // subscription.unsubscribe();
      casosEvolucaoSubscription.unsubscribe();
      totaisSubscription.unsubscribe();
      casosConfirmadosSubscription.unsubscribe();
      mortalidadeSubscription.unsubscribe();
      console.log('Observable desconectado - sem vazamento!');
      if (etlTimerRef.current) {
        clearInterval(etlTimerRef.current);
        etlTimerRef.current = null;
      }
    };
  }, [data ]); // ← Array vazio = executa só uma vez


     const processaEtl = async () => {
      console.log('🚀 Iniciando processo ETL');
      if (loadingEtl) return; // evita múltiplos cliques
      try {
        setLoadingEtl(true);
        setEtlSeconds(0);

        if (etlTimerRef.current) {
          clearInterval(etlTimerRef.current);
        }

        etlTimerRef.current = setInterval(() => {
          setEtlSeconds((prev) => prev + 1);
        }, 1000);

        await fetch('/etl/carregar', { method: 'GET' });
      }catch (err) {  
        console.error('❌ Erro ao iniciar processo ETL:', err);
        alert('Erro ao iniciar processo ETL. Veja console para detalhes.');
        setLoadingEtl(false);
        return;
      }finally {
        if (etlTimerRef.current) {
          clearInterval(etlTimerRef.current);
          etlTimerRef.current = null;
          window.location.reload(); // Recarrega a página para buscar os dados atualizados após o ETL
        }
        setLoadingEtl(false);
      }

    };
  

  return (

    <>
         <TelaPrincipal
           data={data}
           setData={setData}
           processaEtl={processaEtl}
           loadingEtl={loadingEtl}
           etlSeconds={etlSeconds}
         />

      {loadingEtl ? (
        <>
          {/* Skeleton para as métricas */}
          <div className="row mb-4">
            {[1,2,3,4].map((i) => (
              <div key={i} className="col-sm-6 col-lg-3">
                <div className="card h-100">
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                      <div className="skeleton-line mb-2"></div>
                      <div className="skeleton-line w-50"></div>
                    </div>
                    <div className="mt-auto">
                      <div className="skeleton-line w-75"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Skeleton para o gráfico */}
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <div className="skeleton-line w-50"></div>
                </div>
                <div className="card-body">
                  <div className="skeleton-line mb-2"></div>
                  <div className="skeleton-line mb-2"></div>
                  <div className="skeleton-line w-75"></div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Row para as métricas */}
          <div className="row mb-4">
            <div className="col-sm-6 col-lg-3">
              <div className="card h-100">
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <div className="subheader">Linhas de Casos Covid Evolução </div>
                    <div className="h1 mb-3">{casosEvolucao.length}</div>
                  </div>
                  <div className="d-flex align-items-center mt-auto">
                    <small className="text-muted me-2">DATA REFERÊNCIA:</small>
                    <div className="text-green me-2">{formatDateBr(data)}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <div className="card h-100">
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <div className="subheader">Casos Totais</div>
                    <div className="h1 mb-3">{formatNumberBr(casosTotais[0]?.totalCasos)}</div>
                  </div>
                  <div className="d-flex align-items-center mt-auto">
                    <small className="text-muted me-2">DATA REFERÊNCIA:</small>
                    <div className="text-red me-2">{formatDateBr(data)}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <div className="card h-100">
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <div className="subheader">Casos Confirmados</div>
                    <div className="h1 mb-3">{formatNumberBr(casosConfirmados?.reduce((acc, curr) => acc + curr.confirmed, 0))}</div>
                  </div>
                  <div className="d-flex align-items-center mt-auto">
                    <small className="text-muted me-2">DATA REFERÊNCIA:</small>
                    <div className="text-red me-2">{formatDateBr(data)}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <div className="card h-100">
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <div className="subheader">Mortalidade</div>
                    <div className="h1 mb-3">{formatNumberBr(mortalidade[0]?.deaths)}</div>
                  </div>
                  <div className="d-flex align-items-center mt-auto">
                    <small className="text-muted me-2">DATA REFERÊNCIA:</small>
                    <div className="text-red me-2">{formatDateBr(data)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* Row para a tabela */}
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Grafico Evolução de Casos 7 DIAS</h3>
                </div>
                <GraficoBarras
                  dados={casosEvolucao.map(({ date, confirmed }) => ({
                    date,
                    confirmed,
                    dateBr: formatDateBr(date),
                  }))}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Dashboard;