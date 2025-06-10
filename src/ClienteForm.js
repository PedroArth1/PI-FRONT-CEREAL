import React, { useEffect, useState } from "react";
import axios from "axios";
import M from "materialize-css";

const ClienteForm = ({ onUserAdded }) => {
  const [nome, setNome] = useState("");
  const [CpfOuCnpj, setCpfOuCnpj] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");

  useEffect(() => {
    M.updateTextFields(); // Atualiza os labels flutuantes do Materialize
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/clientes", { nome, CpfOuCnpj, telefone, endereco });
      setNome("");
      setCpfOuCnpj("");
      setTelefone("");
      setEndereco("");
      onUserAdded(); // Atualiza a lista após cadastrar
      M.toast({ html: "Cliente cadastrada com sucesso!", classes: "green" });
    } catch (error) {
      console.error("Erro ao cadastrar Cliente:", error);
      M.toast({ html: "Erro ao cadastrar Cliente", classes: "red" });
    }
  };

  return (
    <div className="container">
      <h4>Cadastrar Cliente</h4>
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
            value={CpfOuCnpj}
            onChange={(e) => setCpfOuCnpj(e.target.value)}
            required
          />
          <label htmlFor="cpfouCnpj">cpfouCnpj</label>
        </div>
        <div className="input-field">
          <input
            id="telefone"
            type="text"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            required
          />
          <label htmlFor="telefone">telefone</label>
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
          Cadastrar
        </button>
      </form>
    </div>
  );
};

export default ClienteForm;

