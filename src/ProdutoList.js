import React, { useEffect, useState } from "react";
import axios from "axios";

const ProdutoList = () => {
  const [produtos, setProdutos] = useState([]);

  const fetchProdutos = async () => {
    const response = await axios.get("http://localhost:8080/api/produtos");
    setProdutos(response.data);
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  return (
    <div className="container">
      <h4>Lista de Produtos</h4>
      <ul className="collection">
        {produtos.map((produto) => (
          <li key={produto.id} className="collection-item">
            <strong>{produto.nome}</strong> - {produto.tipo} - {produto.validade} - {produto.preco} - {produto.precoCusto} - {produto.quantidadeEstoque}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProdutoList;

