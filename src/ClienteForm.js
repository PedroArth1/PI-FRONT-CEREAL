import React, { useEffect, useState } from "react";
import axios from "axios";
import M from "materialize-css";

const ClienteForm = ({ onUserAdded, clienteParaEditar, setClienteParaEditar }) => {
  const [nome, setNome] = useState("");
  const [cpfOuCnpj, setCpfOuCnpj] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");

  useEffect(() => {
    M.updateTextFields();
  }, []);

  // Atualiza os campos quando recebe um cliente para editar
  useEffect(() => {
    if (clienteParaEditar) {
      setNome(clienteParaEditar.nome);
      setCpfOuCnpj(clienteParaEditar.cpfOuCnpj);
      setTelefone(clienteParaEditar.telefone);
      setEndereco(clienteParaEditar.endereco);
    } else {
      // Limpa os campos se não houver cliente para editar
      setNome("");
      setCpfOuCnpj("");
      setTelefone("");
      setEndereco("");
    }
  }, [clienteParaEditar]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const clienteData = { nome, cpfOuCnpj, telefone, endereco };

    try {
      if (clienteParaEditar) {
        // Se estiver editando, faz PUT
        await axios.put(
          `http://localhost:8080/api/clientes/${clienteParaEditar.idCliente}`,
          clienteData
        );
        M.toast({ html: "Cliente atualizado com sucesso!", classes: "green" });
      } else {
        // Se não, faz POST (criação)
        await axios.post("http://localhost:8080/api/clientes", clienteData);
        M.toast({ html: "Cliente cadastrado com sucesso!", classes: "green" });
      }

      // Limpa o formulário e atualiza a lista
      setClienteParaEditar(null);
      setNome("");
      setCpfOuCnpj("");
      setTelefone("");
      setEndereco("");
      onUserAdded();
      
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      M.toast({ html: "Erro ao salvar cliente", classes: "red" });
    }
  };

  return (
    <div className="container">
      <h4>{clienteParaEditar ? "Editar Cliente" : "Cadastrar Cliente"}</h4>
      <form onSubmit={handleSubmit}>
        <div className="input-field">
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <label htmlFor="nome">Nome</label>
        </div>
        <div className="input-field">
          <input
            id="cpfouCnpj"
            type="text"
            value={cpfOuCnpj}
            onChange={(e) => setCpfOuCnpj(e.target.value)}
            required
          />
          <label htmlFor="cpfouCnpj">CPF/CNPJ</label>
        </div>
        <div className="input-field">
          <input
            id="telefone"
            type="text"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            required
          />
          <label htmlFor="telefone">Telefone</label>
        </div>
        <div className="input-field">
          <input
            id="endereco"
            type="text"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            required
          />
          <label htmlFor="endereco">Endereço</label>
        </div>
        <button className="btn waves-effect waves-light" type="submit">
          {clienteParaEditar ? "Atualizar" : "Cadastrar"}
        </button>
        {clienteParaEditar && (
          <button 
            className="btn waves-effect waves-light red" 
            style={{marginLeft: '10px'}}
            type="button"
            onClick={() => setClienteParaEditar(null)}
          >
            Cancelar Edição
          </button>
        )}
      </form>
    </div>
  );
};

export default ClienteForm;