import React, { useEffect, useState } from "react";
import axios from "axios";
import M from "materialize-css";

const ProdutoList = ({ onEditProduto }) => {  // Recebe a função de edição via props
  const [produtos, setProdutos] = useState([]);

  const fetchProdutos = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/produtos");
      setProdutos(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      M.toast({ html: "Erro ao buscar produtos", classes: "red" });
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  const handleExcluir = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/produtos/${id}`);
      await fetchProdutos();
      M.toast({ html: "Produto excluído com sucesso!", classes: "green" });
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      M.toast({ html: "Erro ao excluir produto", classes: "red" });
    }
  };

  // Função para formatar valores monetários com segurança
  const formatarMoeda = (valor) => {
    return valor !== null && valor !== undefined 
      ? `R$ ${parseFloat(valor).toFixed(2)}` 
      : "R$ 0.00";
  };

  return (
    <div className="container">
      <h4>Lista de Produtos</h4>
      <table className="striped highlight responsive-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Validade</th>
            <th>Preço</th>
            <th>Preço de Custo</th>
            <th>Estoque</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((produto) => (
            <tr key={produto.id}>
              <td><strong>{produto.nome}</strong></td>
              <td>{produto.tipo || '-'}</td>
              <td>
                {produto.validade 
                  ? new Date(produto.validade).toLocaleDateString() 
                  : 'Sem data'}
              </td>
              <td>{formatarMoeda(produto.preco)}</td>
              <td>{formatarMoeda(produto.precoCusto)}</td>
              <td>
                {produto.quantidadeEstoque !== null && produto.quantidadeEstoque !== undefined
                  ? `${produto.quantidadeEstoque} Kgs`
                  : '0 Kg'}
              </td>
              <td>
                <button
                  className="btn-flat"
                  onClick={() => onEditProduto(produto)}  // Chama a função de edição
                  title="Editar"
                >
                  <i className="material-icons text-darken-2">edit</i>
                </button>
                <button
                  className="btn-flat"
                  onClick={() => handleExcluir(produto.id)}
                  title="Excluir"
                >
                  <i className="material-icons text-darken-2">delete</i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProdutoList;