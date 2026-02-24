import { useState } from "react";
import { toast } from "react-toastify";
import { notifyError, notifySuccess } from "./Toast";

const formatDateBr = (isoDate) => {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) return isoDate;
  return `${day}/${month}/${year}`;
};

function ToastDataForm({ dataAtual, onConfirmar, closeToast }) {
  const [valor, setValor] = useState(dataAtual ?? "");

  const confirmar = () => {
    if (!valor) {
      notifyError("Escolha uma data válida.");
      return;
    }
    onConfirmar(valor);
    notifySuccess(`Data alterada para ${valor}.`);
    closeToast();
  };

  return (
    <div style={{ display: "grid", gap: 10 }}>
      <strong>Alterar data</strong>

      <label style={{ display: "grid", gap: 6 }}>
        <span>Nova data:</span>
        <input
          type="date"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />
      </label>
      

      <div style={{ display: "flex", gap: 8 }}>
        <button type="button" onClick={confirmar}>
          OK
        </button>
        <button type="button" onClick={closeToast}>
          Cancelar
        </button>
      </div>
    </div>
  );
}

function TelaPrincipal({ data, setData, processaEtl, loadingEtl, etlSeconds }) {
  const handleClickData = () => {
    toast(
      ({ closeToast }) => (
        <ToastDataForm
          dataAtual={data}
          onConfirmar={(novaData) => setData(novaData)}
          closeToast={closeToast}
        />
      ),
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        pauseOnHover: true,
      }
    );
  };

  return (
    <div>
      <h1>Data Escolhida</h1>
      <div style={{ display: "flex", justifyContent:"space-between"}}  >
      <p style={{ cursor: "pointer", textDecoration: "none" }} onClick={handleClickData}>
        Data: {formatDateBr(data)}
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button
          className="mb-4 btn btn-primary"
          onClick={processaEtl}
          disabled={loadingEtl}
        >
          {loadingEtl ? 'Processando ETL...' : 'Processar ETL'}
        </button>
        {loadingEtl && (
          <span style={{ fontSize: 14, color: '#666' }}>
            Tempo: {etlSeconds}s
          </span>
        )}
      </div>

      </div>
    </div>
  );
}

export default TelaPrincipal;