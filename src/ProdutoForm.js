import React, { useEffect, useState } from "react";
import axios from "axios";

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
      } else {
        // Criar novo produto
        await axios.post("http://localhost:8080/api/produtos", produtoData);
      }
      
      limparCampos();
      onUserAdded();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    }
  };

  const handleCancelar = () => {
    limparCampos();
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-lg mb-8">
      <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 rounded-t-lg">
        <h2 className="text-xl font-bold text-white">
          {produtoParaEditar ? "Editar Produto" : "Cadastrar Novo Produto"}
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nome */}
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
              Nome *
            </label>
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Tipo */}
          <div>
            <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo
            </label>
            <input
              id="tipo"
              type="text"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Validade */}
          <div>
            <label htmlFor="validade" className="block text-sm font-medium text-gray-700 mb-1">
              Validade
            </label>
            <input
              id="validade"
              type="date"
              value={validade}
              onChange={(e) => setValidade(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Preço (Venda) */}
          <div>
            <label htmlFor="preco" className="block text-sm font-medium text-gray-700 mb-1">
              Preço de Venda *
            </label>
            <input
              id="preco"
              type="number"
              step="0.01"
              min="0"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Preço de Custo */}
          <div>
            <label htmlFor="precoCusto" className="block text-sm font-medium text-gray-700 mb-1">
              Preço de Custo
            </label>
            <input
              id="precoCusto"
              type="number"
              step="0.01"
              min="0"
              value={precoCusto}
              onChange={(e) => setPrecoCusto(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Estoque */}
          <div>
            <label htmlFor="quantidadeEstoque" className="block text-sm font-medium text-gray-700 mb-1">
              Quantidade em Estoque *
            </label>
            <input
              id="quantidadeEstoque"
              type="number"
              step="0.01"
              min="0"
              value={quantidadeEstoque}
              onChange={(e) => setQuantidadeEstoque(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-3">
          {produtoParaEditar && (
            <button 
              type="button"
              onClick={handleCancelar}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-200"
            >
              Cancelar
            </button>
          )}
          <button 
            type="submit"
            className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors duration-200"
          >
            {produtoParaEditar ? "Atualizar Produto" : "Cadastrar Produto"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProdutoForm;