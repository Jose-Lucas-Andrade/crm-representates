import { BrowserRouter, Route, Routes } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from "./layout/Layout";
import Bloqueado from "./pages/Bloqueado";
import Clientes from "./pages/Clientes";
import ClienteDetalhe from "./pages/ClienteDetalhe";
import Dashboard from "./pages/Dashboard";
import DiasSemContato from "./pages/DiasSemContato";
import EditarCliente from "./pages/EditarCliente";
import Hoje from "./pages/Hoje";
import Ajuda from "./pages/Ajuda";
import Login from "./pages/Login";
import NovoCliente from "./pages/NovoCliente";
import NovoContato from "./pages/NovoContato";
import Opportunities from "./pages/Opportunities";
import Register from "./pages/Register";
import Tarefas from "./pages/Tarefas";
import PrivateRoute from "./routes/PrivateRoute";

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/bloqueado" element={<Bloqueado />} />

          <Route
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/hoje" element={<Hoje />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/clientes/novo" element={<NovoCliente />} />
            <Route path="/clientes/:id" element={<ClienteDetalhe />} />
            <Route path="/clientes/:id/editar" element={<EditarCliente />} />
            <Route path="/clientes/:id/contato" element={<NovoContato />} />
            <Route path="/oportunidades" element={<Opportunities />} />
            <Route path="/alertas" element={<DiasSemContato />} />
            <Route path="/tarefas" element={<Tarefas />} />
            <Route path="/ajuda" element={<Ajuda />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
