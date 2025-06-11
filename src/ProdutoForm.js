import React, { useEffect, useState } from "react";
import axios from "axios";
import M from "materialize-css";

const ProdutoForm = ({ onUserAdded, produtoParaEditar, setProdutoParaEditar }) => {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [validade, setValidade] = useState("");
  const [preco, setPreco] = useState("");
  const [precoCusto, setPrecoCusto] = useState("");
  const [quantidadeEstoque, setQuantidadeEstoque] = useState("");

  // Preencher campos quando há produto para editar
  useEffect(() => {
    if (produtoParaEditar) {
      setNome(produtoParaEditar.nome || "");
      setTipo(produtoParaEditar.tipo || "");
      setValidade(produtoParaEditar.validade ? produtoParaEditar.validade.split('T')[0] : "");
      setPreco(produtoParaEditar.preco?.toString() || "");
      setPrecoCusto(produtoParaEditar.precoCusto?.toString() || "");
      setQuantidadeEstoque(produtoParaEditar.quantidadeEstoque?.toString() || "");
    }
  }, [produtoParaEditar]);

  useEffect(() => {
    M.updateTextFields();
  }, []);

  const limparCampos = () => {
    setNome("");
    setTipo("");
    setValidade("");
    setPreco("");
    setPrecoCusto("");
    setQuantidadeEstoque("");
    setProdutoParaEditar(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const produtoData = {
      nome,
      tipo,
      validade: validade || null,
      preco: parseFloat(preco),
      precoCusto: precoCusto ? parseFloat(precoCusto) : null,
      quantidadeEstoque: parseFloat(quantidadeEstoque)
    };

    try {
      if (produtoParaEditar) {
        // Atualizar produto existente
        await axios.put(`http://localhost:8080/api/produtos/${produtoParaEditar.idProduto}`, produtoData);
        M.toast({ html: "Produto atualizado com sucesso!", classes: "green" });
      } else {
        // Criar novo produto
        await axios.post("http://localhost:8080/api/produtos", produtoData);
        M.toast({ html: "Produto cadastrado com sucesso!", classes: "green" });
      }
      
      limparCampos();
      onUserAdded();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      M.toast({ html: "Erro ao salvar produto", classes: "red" });
    }
  };

  const handleCancelar = () => {
    limparCampos();
  };

  return (
    
    <div className="row">
      <div className="col s12 m8 offset-m2 l6 offset-l3">
        <h5>{produtoParaEditar ? "Editar Produto" : "Cadastrar Produto"}</h5>
        
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
            <label htmlFor="tipo">Tipo</label>
          </div>

          {/* Validade */}
          <div className="input-field">
            <input
              id="validade"
              type="date"
              value={validade}
              onChange={(e) => setValidade(e.target.value)}
            />
            <label htmlFor="validade" className="active">Validade</label>
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
            <label htmlFor="precoCusto">Preço de Custo</label>
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

          <div className="row">
            <div className="col s12">
              <button className="btn waves-effect waves-light" type="submit">
                {produtoParaEditar ? "Atualizar" : "Cadastrar"}
              </button>
              {produtoParaEditar && (
                <button 
                  className="btn waves-effect waves-light grey ml-2" 
                  type="button"
                  onClick={handleCancelar}
                  style={{ marginLeft: '10px' }}
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProdutoForm;