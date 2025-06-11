import React, { useEffect, useState, useCallback } from "react";
import { Edit, Trash2, Users, AlertCircle } from "lucide-react";
import axios from "axios";

const ClienteList = ({ onEdit }) => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = "http://localhost:8080/api/clientes";

  const showToast = (message, type = 'success') => {
    alert(message);
  };

  const fetchClientes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(API_BASE_URL);
      setClientes(response.data);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      setError("Erro ao carregar clientes. Tente novamente mais tarde.");
      showToast("Erro ao buscar clientes");
    } finally {
      setLoading(false);
    }
  }, []); // Adicione dependências se a função usar valores externos

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]); // Agora está correto

  const handleExcluir = async (idCliente) => {
    if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
      try {
        await axios.delete(`${API_BASE_URL}/${idCliente}`);
        showToast("Cliente excluído com sucesso");
        fetchClientes();
      } catch (error) {
        console.error("Erro ao excluir cliente:", error);
        
        let errorMessage = "Erro ao excluir cliente";
        if (error.response) {
          if (error.response.status === 409) {
            errorMessage = "Este cliente possui pedidos associados e não pode ser excluído";
          } else {
            errorMessage = `Erro ${error.response.status}: ${error.response.data.message || errorMessage}`;
          }
        }
        
        showToast(errorMessage, 'error');
      }
    }
  };

  // Componente de carregamento
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <span className="ml-4 text-gray-600">Carregando clientes...</span>
          </div>
        </div>
      </div>
    );
  }

  // Componente de erro
  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Erro ao carregar clientes</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchClientes}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-white mr-3" />
            <h2 className="text-2xl font-bold text-white">Lista de Clientes</h2>
            <span className="ml-auto bg-green-500 text-white px-3 py-1 rounded-full text-sm">
              {clientes.length} {clientes.length === 1 ? 'cliente' : 'clientes'}
            </span>
          </div>
        </div>

        {clientes.length === 0 ? (
          <div className="p-12 text-center">
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum cliente encontrado</h3>
            <p className="text-gray-500">Cadastre o primeiro cliente para começar</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CPF/CNPJ
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Telefone
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Endereço
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clientes.map((cliente, index) => (
                    <tr 
                      key={cliente.idCliente} 
                      className={`hover:bg-gray-50 transition-colors duration-200 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{cliente.nome}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {cliente.cpfOuCnpj}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {cliente.telefone}
                      </td>
                      <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                        {cliente.endereco}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => onEdit(cliente)}
                            className="bg-green-100 hover:bg-green-200 text-green-700 p-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                            title="Editar cliente"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleExcluir(cliente.idCliente)}
                            className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                            title="Excluir cliente"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-200">
              {clientes.map((cliente) => (
                <div key={cliente.idCliente} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {cliente.nome}
                      </h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><span className="font-medium">CPF/CNPJ:</span> {cliente.cpfOuCnpj}</p>
                        <p><span className="font-medium">Telefone:</span> {cliente.telefone}</p>
                        <p><span className="font-medium">Endereço:</span> {cliente.endereco}</p>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2 ml-4">
                      <button
                        onClick={() => onEdit(cliente)}
                        className="bg-green-100 hover:bg-green-200 text-green-700 p-2 rounded-lg transition-all duration-200"
                        title="Editar cliente"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleExcluir(cliente.idCliente)}
                        className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-all duration-200"
                        title="Excluir cliente"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ClienteList;