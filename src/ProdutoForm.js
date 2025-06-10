import React, { useEffect, useState } from "react";
import axios from "axios";
import M from "materialize-css";

const ProdutoForm = ({ onUserAdded }) => {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [validade, setValidade] = useState("");
  const [preco, setPreco] = useState("");
  const [precoCusto, setPrecoCusto] = useState("");
  const [quantidadeEstoque, setQuantidadeEstoque] = useState("");

  useEffect(() => {
    M.updateTextFields();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Formatar dados conforme JSON
    const produtoData = {
      nome,
      tipo,
      validade: validade || null, // Permite null se vazio
      preco: parseFloat(preco),
      precoCusto: precoCusto ? parseFloat(precoCusto) : null,
      quantidadeEstoque: parseFloat(quantidadeEstoque)
    };

    try {
      await axios.post("http://localhost:8080/api/produtos", produtoData);
      // Resetar campos
      setNome("");
      setTipo("");
      setValidade("");
      setPreco("");
      setPrecoCusto("");
      setQuantidadeEstoque("");
      
      onUserAdded();
      M.toast({ html: "Produto cadastrado com sucesso!", classes: "green" });
    } catch (error) {
      console.error("Erro ao cadastrar produto:", error);
      M.toast({ html: "Erro ao cadastrar produto", classes: "red" });
    }
  };

  return (
    <div className="container">
      <h4>Cadastrar produto</h4>
      <form onSubmit={handleSubmit}>
        {/* Nome */}
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

        {/* Tipo */}
        <div className="input-field">
          <input
            id="tipo"
            type="text"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          />
          <label htmlFor="tipo">Tipo (opcional)</label>
        </div>

        {/* Validade */}
        <div className="input-field">
          <input
            id="validade"
            type="date"
            value={validade}
            onChange={(e) => setValidade(e.target.value)}
          />
          <label htmlFor="validade" className="active">
            Validade (opcional)
          </label>
        </div>

        {/* Preço (Venda) */}
        <div className="input-field">
          <input
            id="preco"
            type="number"
            step="0.01"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            required
          />
          <label htmlFor="preco">Preço de Venda</label>
        </div>

        {/* Preço de Custo */}
        <div className="input-field">
          <input
            id="precoCusto"
            type="number"
            step="0.01"
            value={precoCusto}
            onChange={(e) => setPrecoCusto(e.target.value)}
          />
          <label htmlFor="precoCusto">Preço de Custo (opcional)</label>
        </div>

        {/* Estoque */}
        <div className="input-field">
          <input
            id="quantidadeEstoque"
            type="number"
            step="0.01"
            value={quantidadeEstoque}
            onChange={(e) => setQuantidadeEstoque(e.target.value)}
            required
          />
          <label htmlFor="quantidadeEstoque">Quantidade em Estoque</label>
        </div>

        <button className="btn waves-effect waves-light" type="submit">
          Cadastrar
        </button>
      </form>
    </div>
  );
};

export default ProdutoForm;