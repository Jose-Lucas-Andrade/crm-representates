import { BrowserRouter, Routes, Route } from "react-router-dom";

import ErrorBoundary from "./components/ErrorBoundary";
import PrivateRoute from "./routes/PrivateRoute";
import Layout from "./layout/Layout";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import ClienteDetalhe from "./pages/ClienteDetalhe";
import EditarCliente from "./pages/EditarCliente";
import NovoCliente from "./pages/NovoCliente";
import NovoContato from "./pages/NovoContato";
import Opportunities from "./pages/Opportunities";
import DiasSemContato from "./pages/DiasSemContato";
import Alertas from "./pages/Alertas";
import Tarefas from "./pages/Tarefas";


export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          {/* Rota pública */}
          <Route path="/login" element={<Login />} />

          {/* Rotas protegidas */}
          <Route
            path="/"
            element={
              <PrivateRoute>
              <Layout>
              <Dashboard />
              </Layout>
              </PrivateRoute>
        }
      />


          <Route
            path="/clientes"
            element={
              <PrivateRoute>
                <Clientes />
              </PrivateRoute>
            }
          />

          <Route
            path="/clientes/novo"
            element={
              <PrivateRoute>
                <NovoCliente />
              </PrivateRoute>
            }
          />

          <Route
            path="/clientes/:id"
            element={
              <PrivateRoute>
                <ClienteDetalhe />
              </PrivateRoute>
            }
          />

          <Route
            path="/clientes/:id/editar"
            element={
              <PrivateRoute>
                <EditarCliente />
              </PrivateRoute>
            }
          />

          <Route
            path="/clientes/:id/contato"
            element={
              <PrivateRoute>
                <NovoContato />
              </PrivateRoute>
            }
          />

          <Route
            path="/oportunidades"
            element={
              <PrivateRoute>
                <Opportunities />
              </PrivateRoute>
            }
          />

          <Route
            path="/alertas"
            element={
              <PrivateRoute>
                <DiasSemContato />
              </PrivateRoute>
            }
          />
          <Route
            path="/tarefas"
            element={
              <PrivateRoute>
                <Tarefas />
              </PrivateRoute>
            }
          />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
