import React, { useEffect, useState } from "react";
import axios from "axios"; // importa o axios

const ClienteForm = ({ onUserAdded, clienteParaEditar, setClienteParaEditar }) => {
  const [nome, setNome] = useState("");
  const [cpfOuCnpj, setCpfOuCnpj] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (clienteParaEditar) {
      setNome(clienteParaEditar.nome);
      setCpfOuCnpj(clienteParaEditar.cpfOuCnpj);
      setTelefone(clienteParaEditar.telefone);
      setEndereco(clienteParaEditar.endereco);
    } else {
      setNome("");
      setCpfOuCnpj("");
      setTelefone("");
      setEndereco("");
    }
  }, [clienteParaEditar]);

  const showToast = (message, type = 'success') => {
    alert(message); // substitua por uma lib de toast se desejar
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const clienteData = { nome, cpfOuCnpj, telefone, endereco };

    try {
      if (clienteParaEditar) {
        // PUT para atualizar cliente
        await axios.put(`http://localhost:8080/api/clientes/${clienteParaEditar.idCliente}`, clienteData);
        showToast("Cliente atualizado com sucesso!");
      } else {
        // POST para criar cliente novo
        await axios.post("http://localhost:8080/api/clientes", clienteData);
        showToast("Cliente cadastrado com sucesso!");
      }

      // Limpa tudo
      setClienteParaEditar(null);
      setNome("");
      setCpfOuCnpj("");
      setTelefone("");
      setEndereco("");
      onUserAdded(); // atualiza lista

    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      showToast("Erro ao salvar cliente");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setClienteParaEditar(null);
    setNome("");
    setCpfOuCnpj("");
    setTelefone("");
    setEndereco("");
  };

  const handleCancel = () => {
    setClienteParaEditar(null);
    setNome("");
    setCpfOuCnpj("");
    setTelefone("");
    setEndereco("");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          {clienteParaEditar ? "Editar Cliente" : "Cadastrar Cliente"}
        </h2>
        <div className="w-16 h-1 bg-green-500 rounded"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6"> {/* alterado para <form> */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome *</label>
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 outline-none"
              placeholder="Digite o nome completo"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="cpfouCnpj" className="block text-sm font-medium text-gray-700">CPF/CNPJ *</label>
            <input
              id="cpfouCnpj"
              type="text"
              value={cpfOuCnpj}
              onChange={(e) => setCpfOuCnpj(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 outline-none"
              placeholder="000.000.000-00 ou 00.000.000/0000-00"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">Telefone *</label>
            <input
              id="telefone"
              type="text"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 outline-none"
              placeholder="(00) 00000-0000"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="endereco" className="block text-sm font-medium text-gray-700">Endereço *</label>
            <input
              id="endereco"
              type="text"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 outline-none"
              placeholder="Rua, número, bairro, cidade"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button 
            type="submit"
            disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Salvando...
              </>
            ) : (
              clienteParaEditar ? "Atualizar Cliente" : "Cadastrar Cliente"
            )}
          </button>

          {clienteParaEditar && (
            <button 
              type="button"
              onClick={handleCancel}
              className="flex-1 sm:flex-none bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Cancelar Edição
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ClienteForm;
