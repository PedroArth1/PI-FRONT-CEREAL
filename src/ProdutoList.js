import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Edit, Trash2 } from "lucide-react";
import ProdutoForm from "./ProdutoForm";

const ProdutoList = ({ onEditProduto, updateTrigger }) => {
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const fetchProdutos = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/produtos");
      setProdutos(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      showToast("Erro ao buscar produtos", "error");
    }
  }, []);

  useEffect(() => {
    fetchProdutos();
  }, [fetchProdutos, updateTrigger]);

  const handleEditar = (produto) => {
    setProdutoSelecionado(produto);
    if (onEditProduto) onEditProduto(produto);
  };


  const handleExcluir = async (idProduto, nome) => {
    const confirmar = window.confirm(`Tem certeza que deseja excluir o produto "${nome}"?`);
    if (!confirmar) return;

    try {
      await axios.delete(`http://localhost:8080/api/produtos/${idProduto}`);
      await fetchProdutos();
      showToast("Produto excluído com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      showToast("Erro ao excluir produto", "error");
    }
  };

  const formatarMoeda = (valor) => {
    return valor !== null && valor !== undefined 
      ? `R$ ${parseFloat(valor).toFixed(2).replace('.', ',')}` 
      : "R$ 0,00";
  };

  const formatarEstoque = (quantidade) => {
    return quantidade !== null && quantidade !== undefined
      ? `${quantidade} Kg${quantidade !== 1 ? '' : ''}`
      : '0 Kg';
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Toast Notification */}
      {toast.show && (
        <div 
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg text-white ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          } transition-opacity duration-300`}
        >
          {toast.message}
        </div>
      )}

      <ProdutoForm
  produtoParaEditar={produtoSelecionado}
  setProdutoParaEditar={setProdutoSelecionado}  // Passando a função de atualização
  onUserAdded={() => {
    fetchProdutos();  // Atualiza a lista
    setProdutoSelecionado(null);  // Limpa seleção
  }}
/>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mt-8">
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold text-white">Lista de Produtos</h2>
            <span className="ml-auto bg-green-500 text-white px-3 py-1 rounded-full text-sm">
              {produtos.length} {produtos.length === 1 ? 'produto' : 'produtos'}
            </span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Validade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preço de Custo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estoque
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {produtos.map((produto) => (
                <tr key={produto.idProduto} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{produto.nome}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {produto.tipo || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {produto.validade 
                      ? new Date(produto.validade).toLocaleDateString('pt-BR') 
                      : 'Sem data'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {formatarMoeda(produto.preco)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {formatarMoeda(produto.precoCusto)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {formatarEstoque(produto.quantidadeEstoque)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleEditar(produto)}
                        className="bg-green-100 hover:bg-green-200 text-green-700 p-2 rounded-lg transition-all duration-200"
                        title="Editar produto"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleExcluir(produto.idProduto, produto.nome)}
                        className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-all duration-200"
                        title="Excluir produto"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {produtos.length === 0 && (
            <div className="text-center py-8 bg-gray-50">
              <div className="text-gray-500">Nenhum produto encontrado</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProdutoList;