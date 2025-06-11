import React, { useEffect, useState } from "react";
import axios from "axios";
import M from "materialize-css";

const ProdutoList = ({ onEditProduto, updateTrigger }) => {
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
  }, [updateTrigger]);

  const handleExcluir = async (idProduto, nome) => {
    // Confirmação antes de excluir
    if (window.confirm(`Tem certeza que deseja excluir o produto "${nome}"?`)) {
      try {
        await axios.delete(`http://localhost:8080/api/produtos/${idProduto}`);
        await fetchProdutos();
        M.toast({ html: "Produto excluído com sucesso!", classes: "green" });
      } catch (error) {
        console.error("Erro ao excluir produto:", error);
        M.toast({ html: "Erro ao excluir produto", classes: "red" });
      }
    }
  };

  const formatarMoeda = (valor) => {
    return valor !== null && valor !== undefined 
      ? `R$ ${parseFloat(valor).toFixed(2)}` 
      : "R$ 0,00";
  };

  const formatarEstoque = (quantidade) => {
    return quantidade !== null && quantidade !== undefined
      ? `${quantidade} Kg${quantidade !== 1 ? 's' : ''}`
      : '0 Kg';
  };

  return (
    <div className="row">
      <div className="col s12">
        <h5>Lista de Produtos</h5>
        
        {produtos.length === 0 ? (
          <div className="card-panel">
            <p>Nenhum produto cadastrado.</p>
          </div>
        ) : (
          <table className="striped responsive-table">
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
                  <td>{produto.nome}</td>
                  <td>{produto.tipo || '-'}</td>
                  <td>
                    {produto.validade 
                      ? new Date(produto.validade).toLocaleDateString('pt-BR') 
                      : 'Sem data'}
                  </td>
                  <td>{formatarMoeda(produto.preco)}</td>
                  <td>{formatarMoeda(produto.precoCusto)}</td>
                  <td>{formatarEstoque(produto.quantidadeEstoque)}</td>
                  <td>
                    <button
                      className="btn-small waves-effect waves-light blue"
                      onClick={() => onEditProduto(produto)}
                      title="Editar"
                      style={{ marginRight: '5px' }}
                    >
                      <i className="material-icons">edit</i>
                    </button>
                    <button
                      className="btn-small waves-effect waves-light red"
                      onClick={() => handleExcluir(produto.idProduto, produto.nome)}
                      title="Excluir"
                    >
                      <i className="material-icons">delete</i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ProdutoList;
