import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const formatNumberBr = (value) => {
  if (value === null || value === undefined || Number.isNaN(value)) return "-";
  return new Intl.NumberFormat("pt-BR").format(Number(value));
};

export default function GraficoLinhas({ dados = [] }) {
  const dadosOrdenados = [...dados].sort((a, b) => a.date.localeCompare(b.date));

  // debug rápido
  console.log("dados.length =", dados.length, "exemplo =", dados[0]);

  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={dadosOrdenados} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="dateBr" />
          <YAxis tickFormatter={formatNumberBr} />
          <Tooltip formatter={(value) => formatNumberBr(value)} />
          <Line
            type="monotone"
            dataKey="confirmed"
            stroke="#2563eb"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}