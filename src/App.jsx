import { BrowserRouter, Routes, Route } from "react-router-dom";

import ErrorBoundary from "./components/ErrorBoundary";
import PrivateRoute from "./routes/PrivateRoute";
import Layout from "./layout/Layout";

import { AuthProvider } from "./context/AuthContext";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Bloqueado from "./pages/Bloqueado";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import ClienteDetalhe from "./pages/ClienteDetalhe";
import EditarCliente from "./pages/EditarCliente";
import NovoCliente from "./pages/NovoCliente";
import NovoContato from "./pages/NovoContato";
import Opportunities from "./pages/Opportunities";
import DiasSemContato from "./pages/DiasSemContato";
import Tarefas from "./pages/Tarefas";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider> 
        <ErrorBoundary>
          <Routes>

            {/* Rotas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Rotas protegidas */}
            <Route
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route path="/" element={<Dashboard />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/clientes/novo" element={<NovoCliente />} />
              <Route path="/clientes/:id" element={<ClienteDetalhe />} />
              <Route path="/clientes/:id/editar" element={<EditarCliente />} />
              <Route path="/clientes/:id/contato" element={<NovoContato />} />
              <Route path="/oportunidades" element={<Opportunities />} />
              <Route path="/alertas" element={<DiasSemContato />} />
              <Route path="/tarefas" element={<Tarefas />} />
              <Route path="/bloqueado" element={<Bloqueado />} />
            </Route>

          </Routes>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
}