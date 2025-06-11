import React, { useEffect, useState } from "react";
import { Autocomplete, TextField, Card, CardContent, Typography, Alert, Chip, Button } from "@mui/material";
import axios from "axios";

const VendaForm = ({ onCancel }) => {
    const [cliente, setCliente] = useState(null);
    const [clienteInputValue, setClienteInputValue] = useState("");
    const [clientesLike, setClientesLike] = useState([]);

    const [produto, setProduto] = useState(null);
    const [produtoInputValue, setProdutoInputValue] = useState("");
    const [produtosLike, setProdutosLike] = useState([]);

    const [itens, setItens] = useState([]);
    const [valorTotal, setValorTotal] = useState(0.0);
    const [dataVenda, setDataVenda] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", type: "" });

    // Mostrar toast temporário
    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
    };

    useEffect(() => {
        const delay = setTimeout(() => {
            if (clienteInputValue && clienteInputValue.length >= 2) {
                axios.get(`http://localhost:8080/api/clientes/likenome/${clienteInputValue}`)
                    .then((response) => setClientesLike(response.data))
                    .catch((error) => console.error("Erro ao buscar clientes:", error));
            } else {
                setClientesLike([]);
            }
        }, 500);

        return () => clearTimeout(delay);
    }, [clienteInputValue]);

    useEffect(() => {
        const delay = setTimeout(() => {
            if (produtoInputValue && produtoInputValue.length >= 2) {
                axios.get(`http://localhost:8080/api/produtos/likenome/${produtoInputValue}`)
                    .then((response) => setProdutosLike(response.data))
                    .catch((error) => console.error("Erro ao buscar produtos:", error));
            } else {
                setProdutosLike([]);
            }
        }, 500);

        return () => clearTimeout(delay);
    }, [produtoInputValue]);

    const handleAddItem = () => {
        if (produto) {
            // Verifica se o produto já foi adicionado
            const produtoExistente = itens.find(item => item.produto.idProduto === produto.idProduto);
            
            if (produtoExistente) {
                // Verifica quantidadeEstoque antes de aumentar quantidade
                const novaQuantidade = produtoExistente.quantidade + 1;
                const quantidadeEstoque = produto.quantidadeEstoque;
                
                if (quantidadeEstoque !== undefined && novaQuantidade > quantidadeEstoque) {
                    showToast(`⚠️ Não é possível adicionar mais itens. Estoque disponível: ${quantidadeEstoque}`, "warning");
                    return;
                }
                
                // Se já existe e há estoque, aumenta a quantidade
                const novosItens = itens.map(item => 
                    item.produto.idProduto === produto.idProduto 
                        ? { ...item, quantidade: novaQuantidade }
                        : item
                );
                setItens(novosItens);
                showToast("Quantidade do produto aumentada!", "success");
            } else {
                // Verifica estoque antes de adicionar novo item
                const quantidadeEstoque = produto.quantidadeEstoque;
                if (quantidadeEstoque !== undefined && quantidadeEstoque <= 0) {
                    showToast(`❌ Produto sem estoque disponível!`, "error");
                    return;
                }
                
                // Se não existe, adiciona novo item
                const item = {
                    produto,
                    precoUnitario: produto.preco,
                    custoUnitario: produto.precoCusto || null,
                    quantidade: 1,
                };
                setItens([...itens, item]);
                showToast("Produto adicionado!", "success");
            }
            
            setProduto(null);
            setProdutoInputValue("");
        }
    }

    const handleRemoveItem = (item) => {
        if (item) {
            const newItens = itens.filter(itemR => itemR.produto.idProduto !== item.produto.idProduto);
            setItens(newItens);
            showToast("Produto removido!", "warning");
        }
    }

    useEffect(() => {
        let newTotal = 0.0;
        for (let i = 0; i < itens.length; i++) {
            newTotal += itens[i].quantidade * itens[i].precoUnitario;
        }
        setValorTotal(newTotal);
    }, [itens]);

    const handleChange = (index, campo, valor) => {
        const novosItens = [...itens];

        if (campo === 'precoUnitario') {
            novosItens[index].precoUnitario = parseFloat(valor) || 0;
        } else if (campo === 'quantidade') {
            const novaQuantidade = parseFloat(valor) || 0;
            const quantidadeEstoque = novosItens[index].produto.quantidadeEstoque;
            
            // Verifica se a quantidade não excede o estoque
            if (quantidadeEstoque !== undefined && novaQuantidade > quantidadeEstoque) {
                showToast(`⚠️ Quantidade não pode exceder o estoque disponível (${quantidadeEstoque})!`, "warning");
                novosItens[index].quantidade = quantidadeEstoque;
            } else {
                novosItens[index].quantidade = novaQuantidade;
            }
        }

        setItens(novosItens);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validações
        if (!cliente) {
            showToast("Por favor, selecione um cliente!", "error");
            return;
        }
        
        if (itens.length === 0) {
            showToast("Adicione pelo menos um produto à venda!", "error");
            return;
        }

        setLoading(true);
        
        try {
            const venda = {
                data: dataVenda,
                cliente,
                valorTotal,
                itens: itens.map(item => ({
                    produto: item.produto,
                    precoUnitario: item.precoUnitario,
                    custoUnitario: item.custoUnitario,
                    quantidade: item.quantidade
                }))
            };

            await axios.post("http://localhost:8080/api/vendas", venda);
            
            showToast("Venda realizada com sucesso!", "success");
            
            // Resetar formulário após sucesso
            setCliente(null);
            setClienteInputValue("");
            setItens([]);
            setValorTotal(0.0);
            setDataVenda(new Date().toISOString().split('T')[0]);

        } catch (error) {
            console.error("Erro ao efetuar venda:", error);
            showToast("Erro ao efetuar venda: " + (error.response?.data?.message || error.message), "error");
        } finally {
            setLoading(false);
        }
    };

    const limparFormulario = () => {
        setCliente(null);
        setClienteInputValue("");
        setItens([]);
        setValorTotal(0.0);
        setDataVenda(new Date().toISOString().split('T')[0]);
        setProduto(null);
        setProdutoInputValue("");
        showToast("Formulário limpo!", "info");
    };

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            {/* Toast Notification */}
            {toast.show && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white ${
                    toast.type === "error" ? "bg-red-500" :
                    toast.type === "success" ? "bg-green-500" :
                    toast.type === "warning" ? "bg-yellow-500" : "bg-green-500"
                }`}>
                    {toast.message}
                </div>
            )}

            <Card elevation={3} className="mb-6">
                <CardContent>
                    <Typography variant="h4" component="h1" className="mb-4 text-green-600 font-bold">
                        🛍️ Nova Venda
                    </Typography>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    📅 Data da Venda
                                </label>
                                <input 
                                    type="date" 
                                    value={dataVenda}
                                    onChange={(e) => setDataVenda(e.target.value)}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-1 text-green-600">
                                    💰 Total da Venda
                                </label>
                                <input 
                                    type="text" 
                                    value={`R$ ${valorTotal.toFixed(2)}`} 
                                    disabled
                                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-green-600 font-bold text-lg"
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">
                                👤 Cliente
                            </label>
                            <Autocomplete
                                value={cliente}
                                onChange={(event, newValue) => setCliente(newValue)}
                                inputValue={clienteInputValue}
                                onInputChange={(event, newInputValue) => setClienteInputValue(newInputValue)}
                                options={clientesLike}
                                noOptionsText="Digite pelo menos 2 caracteres para buscar..."
                                getOptionLabel={(option) => option?.nome || ""}
                                isOptionEqualToValue={(option, value) => option?.id === value?.id}
                                renderInput={(params) => (
                                    <TextField 
                                        {...params} 
                                        variant="outlined"
                                        placeholder="Digite o nome do cliente..."
                                        size="small"
                                        fullWidth
                                    />
                                )}
                                renderOption={(props, option) => (
                                    <li {...props} key={option?.id} className="p-2">
                                        <div>
                                            <strong>{option?.nome}</strong>
                                            <br />
                                            <small className="text-gray-600">{option?.cpfOuCnpj}</small>
                                        </div>
                                    </li>
                                )}
                            />
                            {cliente && (
                                <Chip 
                                    label={`✅ ${cliente.nome}`} 
                                    color="primary" 
                                    className="mt-2"
                                />
                            )}
                        </div>

                        <div className="flex flex-wrap justify-center gap-2 mt-6">
                            <Button
                                variant="contained"
                                color="success"
                                type="submit"
                                disabled={loading || !cliente || itens.length === 0}
                                className="flex items-center gap-1 min-w-[180px]"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Salvando...
                                    </>
                                ) : (
                                    <>💾 Finalizar Venda</>
                                )}
                            </Button>
                            
                            <Button
                                variant="contained"
                                color="warning"
                                onClick={limparFormulario}
                                className="flex items-center gap-1 min-w-[120px]"
                            >
                                🧹 Limpar
                            </Button>
                            
                            <Button
                                variant="contained"
                                color="error"
                                onClick={onCancel}
                                className="flex items-center gap-1 min-w-[120px]"
                            >
                                ❌ Cancelar
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
            
            <Card elevation={3}>
                <CardContent>
                    <Typography variant="h5" component="h2" className="mb-4 text-green-600 font-bold">
                        🛒 Adicionar Produtos
                    </Typography>
                    
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                            🔍 Buscar Produto
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-3">
                                <Autocomplete
                                    value={produto}
                                    onChange={(event, newValue) => setProduto(newValue)}
                                    inputValue={produtoInputValue}
                                    onInputChange={(event, newInputValue) => setProdutoInputValue(newInputValue)}
                                    options={produtosLike}
                                    noOptionsText="Digite pelo menos 2 caracteres para buscar..."
                                    getOptionLabel={(option) => option?.nome || ""}
                                    isOptionEqualToValue={(option, value) => option?.idProduto === value?.idProduto}
                                    renderInput={(params) => (
                                        <TextField 
                                            {...params} 
                                            variant="outlined"
                                            placeholder="Digite o nome do produto..."
                                            size="small"
                                            fullWidth
                                        />
                                    )}
                                    renderOption={(props, option) => (
                                        <li {...props} key={option?.idProduto} className="p-2">
                                            <div>
                                                <strong>{option?.nome}</strong>
                                                <br />
                                                <span className="text-green-600 font-bold">
                                                    R$ {option?.preco?.toFixed(2)}
                                                </span>
                                            </div>
                                        </li>
                                    )}
                                />
                            </div>
                            <div>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleAddItem}
                                    disabled={!produto}
                                    className="w-full h-full"
                                >
                                    ➕ Adicionar
                                </Button>
                            </div>
                        </div>
                    </div>

                    {itens.length > 0 ? (
                        <div>
                            <Typography variant="h6" className="mb-4 text-green-600">
                                📋 Itens da Venda ({itens.length} {itens.length === 1 ? 'item' : 'itens'})
                            </Typography>
                            
                            <div className="overflow-x-auto">
                                <table className="min-w-full border border-gray-200">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="py-2 px-4 text-left">ID</th>
                                            <th className="py-2 px-4 text-left">Produto</th>
                                            <th className="py-2 px-4 text-center">Valor Unit.</th>
                                            <th className="py-2 px-4 text-center">Qtde</th>
                                            <th className="py-2 px-4 text-center">Estoque</th>
                                            <th className="py-2 px-4 text-center">Custo Unit.</th>
                                            <th className="py-2 px-4 text-center">Subtotal</th>
                                            <th className="py-2 px-4 text-center">Ação</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {itens.map((item, index) => (
                                            <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                                                <td className="py-2 px-4 font-bold text-center">
                                                    {item.produto.idProduto}
                                                </td>
                                                <td className="py-2 px-4 font-bold">
                                                    {item.produto.nome}
                                                </td>
                                                <td className="py-2 px-4 text-center">
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={item.precoUnitario}
                                                        onChange={(e) => handleChange(index, 'precoUnitario', e.target.value)}
                                                        className="w-24 p-1 border border-gray-300 rounded text-center focus:ring-green-500 focus:border-green-500"
                                                    />
                                                </td>
                                                <td className="py-2 px-4 text-center">
                                                    <input
                                                        type="number"
                                                        step="1"
                                                        value={item.quantidade}
                                                        onChange={(e) => handleChange(index, 'quantidade', e.target.value)}
                                                        max={item.produto.quantidadeEstoque || 999999}
                                                        className="w-20 p-1 border border-gray-300 rounded text-center focus:ring-green-500 focus:border-green-500"
                                                    />
                                                </td>
                                                <td className="py-2 px-4 text-center font-bold" style={{ 
                                                    color: (item.produto.quantidadeEstoque || 0) <= 0 ? '#f44336' : 
                                                           (item.produto.quantidadeEstoque || 0) <= 10 ? '#ff9800' : '#4caf50'
                                                }}>
                                                    {item.produto.quantidadeEstoque ?? 'N/A'}
                                                    {item.produto.quantidadeEstoque !== undefined && item.produto.quantidadeEstoque <= 10 && item.produto.quantidadeEstoque > 0 && (
                                                        <div className="text-xs">Baixo</div>
                                                    )}
                                                    {item.produto.quantidadeEstoque !== undefined && item.produto.quantidadeEstoque <= 0 && (
                                                        <div className="text-xs">Esgotado</div>
                                                    )}
                                                </td>
                                                <td className="py-2 px-4 text-center text-gray-600">
                                                    {item.custoUnitario ? `R$ ${item.custoUnitario.toFixed(2)}` : 'N/A'}
                                                </td>
                                                <td className="py-2 px-4 text-center font-bold text-green-600">
                                                    R$ {(item.quantidade * item.precoUnitario).toFixed(2)}
                                                </td>
                                                <td className="py-2 px-4 text-center">
                                                    <button 
                                                        type="button"
                                                        onClick={() => handleRemoveItem(item)}
                                                        title="Remover item"
                                                        className="p-2 text-red-600 hover:text-red-800"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <Alert severity="info" className="mt-4">
                            <strong>Nenhum produto adicionado ainda.</strong>
                            <br />
                            Use o campo de busca acima para encontrar e adicionar produtos à venda.
                        </Alert>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default VendaForm;