import React, { useEffect, useState } from "react";
import axios from "axios";
import M from "materialize-css";

const ClienteList = () => {
  const [clientes, setClientes] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);

  const fetchClientes = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/clientes");
      setClientes(response.data);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      M.toast({ html: "Erro ao buscar clientes", classes: "red" });
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleEditar = (cliente) => {
    // Dispara um evento customizado com o cliente selecionado
    setClienteSelecionado(cliente);
    const evento = new CustomEvent("editarCliente", { detail: clienteSelecionado });
    window.dispatchEvent(evento);
  };

  const handleExcluir = async (idCliente) => {
    try {
      await axios.delete(`http://localhost:8080/api/clientes/${idCliente}`);
      M.toast({ html: "Cliente excluído com sucesso", classes: "green" });
      fetchClientes();
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
      M.toast({ html: "Erro ao excluir cliente", classes: "red" });
    }
  };

  return (
    <div className="container">
      <h4>Lista de Clientes</h4>
      <table className="striped highlight responsive-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>CPF/CNPJ</th>
            <th>Telefone</th>
            <th>Endereço</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.idCliente}>
              <td>{cliente.nome}</td>
              <td>{cliente.cpfOuCnpj}</td>
              <td>{cliente.telefone}</td>
              <td>{cliente.endereco}</td>
              <td>
                <button
                  className="btn-flat"
                  onClick={() => handleEditar(cliente)}
                  title="Editar"
                >
                  <i className="material-icons">edit</i>
                </button>
                <button
                  className="btn-flat"
                  onClick={() => handleExcluir(cliente.idCliente)}
                  title="Excluir"
                >
                  <i className="material-icons">delete</i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClienteList;
