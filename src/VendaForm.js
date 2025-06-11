import React, { useEffect, useState } from "react";
import { Autocomplete, TextField, Card, CardContent, Typography, Alert, Chip } from "@mui/material";
import axios from "axios";
import M from "materialize-css";

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
                    M.toast({ 
                        html: `⚠️ Não é possível adicionar mais itens. quantidadeEstoque disponível: ${quantidadeEstoque}`, 
                        classes: "orange" 
                    });
                    return;
                }
                
                // Se já existe e há quantidadeEstoque, aumenta a quantidade
                const novosItens = itens.map(item => 
                    item.produto.idProduto === produto.idProduto 
                        ? { ...item, quantidade: novaQuantidade }
                        : item
                );
                setItens(novosItens);
                M.toast({ html: "Quantidade do produto aumentada!", classes: "blue" });
            } else {
                // Verifica quantidadeEstoque antes de adicionar novo item
                const quantidadeEstoque = produto.quantidadeEstoque;
                if (quantidadeEstoque !== undefined && quantidadeEstoque <= 0) {
                    M.toast({ 
                        html: `❌ Produto sem quantidadeEstoque disponível!`, 
                        classes: "red" 
                    });
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
                M.toast({ html: "Produto adicionado!", classes: "green" });
            }
            
            setProduto(null);
            setProdutoInputValue("");
        }
    }

    const handleRemoveItem = (item) => {
        if (item) {
            const newItens = itens.filter(itemR => itemR.produto.idProduto !== item.produto.idProduto);
            setItens(newItens);
            M.toast({ html: "Produto removido!", classes: "orange" });
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
            
            // Verifica se a quantidade não excede o quantidadeEstoque
            if (quantidadeEstoque !== undefined && novaQuantidade > quantidadeEstoque) {
                M.toast({ 
                    html: `⚠️ Quantidade não pode exceder o quantidadeEstoque disponível (${quantidadeEstoque})!`, 
                    classes: "orange" 
                });
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
            M.toast({ html: "Por favor, selecione um cliente!", classes: "red" });
            return;
        }
        
        if (itens.length === 0) {
            M.toast({ html: "Adicione pelo menos um produto à venda!", classes: "red" });
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

            console.log("Venda a ser enviada:", venda);

            await axios.post("http://localhost:8080/api/vendas", venda);
            
            M.toast({ html: "Venda realizada com sucesso!", classes: "green" });
            
            // Resetar formulário após sucesso
            setCliente(null);
            setClienteInputValue("");
            setItens([]);
            setValorTotal(0.0);
            setDataVenda(new Date().toISOString().split('T')[0]);

        } catch (error) {
            console.error("Erro ao efetuar venda:", error);
            M.toast({ html: "Erro ao efetuar venda: " + (error.response?.data?.message || error.message), classes: "red" });
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
        M.toast({ html: "Formulário limpo!", classes: "blue" });
    };

    return (
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            <Card elevation={3} style={{ marginBottom: '20px' }}>
                <CardContent>
                    <Typography variant="h4" component="h1" gutterBottom style={{ color: '#1976d2', fontWeight: 'bold' }}>
                        🛍️ Nova Venda
                    </Typography>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col s12 m6">
                                <div className="input-field">
                                    <label htmlFor="dataVenda" style={{ fontSize: '14px', fontWeight: 'bold' }}>
                                        📅 Data da Venda
                                    </label>
                                    <input 
                                        id="dataVenda"
                                        type="date" 
                                        value={dataVenda}
                                        onChange={(e) => setDataVenda(e.target.value)}
                                        required
                                        style={{ marginTop: '10px' }}
                                    />
                                </div>
                            </div>
                            
                            <div className="col s12 m6">
                                <div className="input-field">
                                    <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#4caf50'}}>
                                        💰 Total da Venda
                                    </label>
                                    <input 
                                        type="text" 
                                        value={`R$ ${valorTotal.toFixed(2)}`} 
                                        disabled={true}
                                        style={{ 
                                            marginTop: '10px',
                                            fontSize: '18px',
                                            fontWeight: 'bold',
                                            color: '#4caf50'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '20px' }}>
                            <label style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px', display: 'block' }}>
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
                                    <li {...props} key={option?.id} style={{ padding: '10px' }}>
                                        <div>
                                            <strong>{option?.nome}</strong>
                                            <br />
                                            <small style={{ color: '#666' }}>{option?.cpfOuCnpj}</small>
                                        </div>
                                    </li>
                                )}
                            />
                            {cliente && (
                                <Chip 
                                    label={`✅ ${cliente.nome}`} 
                                    color="primary" 
                                    style={{ marginTop: '10px' }}
                                />
                            )}
                        </div>

                        <div style={{ marginTop: '30px', textAlign: 'center' }}>
                            <button 
                                className="btn waves-effect waves-light green" 
                                type="submit"
                                disabled={loading || !cliente || itens.length === 0}
                                style={{ marginRight: '10px', padding: '0 30px' }}
                            >
                                {loading ? "Salvando..." : "💾 Finalizar Venda"}
                            </button>
                            
                            <button
                                className="btn waves-effect waves-light orange"
                                type="button"
                                onClick={limparFormulario}
                                style={{ marginRight: '10px' }}
                            >
                                🧹 Limpar
                            </button>
                            
                            <button
                                className="btn waves-effect waves-light red"
                                type="button"
                                onClick={onCancel}
                            >
                                ❌ Cancelar
                            </button>
                        </div>
                    </form>
                </CardContent>
            </Card>
            
            <Card elevation={3}>
                <CardContent>
                    <Typography variant="h5" component="h2" gutterBottom style={{ color: '#1976d2', fontWeight: 'bold' }}>
                        🛒 Adicionar Produtos
                    </Typography>
                    
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px', display: 'block' }}>
                            🔍 Buscar Produto
                        </label>
                        <div className="row" style={{ marginBottom: '0' }}>
                            <div className="col s12 m9">
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
                                        <li {...props} key={option?.idProduto} style={{ padding: '10px' }}>
                                            <div>
                                                <strong>{option?.nome}</strong>
                                                <br />
                                                <span style={{ color: '#4caf50', fontWeight: 'bold' }}>
                                                    R$ {option?.preco?.toFixed(2)}
                                                </span>
                                            </div>
                                        </li>
                                    )}
                                />
                            </div>
                            <div className="col s12 m3">
                                <button 
                                    className="btn waves-effect waves-light blue"
                                    type="button"
                                    onClick={handleAddItem}
                                    disabled={!produto}
                                    style={{ width: '100%', height: '40px' }}
                                >
                                    ➕ Adicionar
                                </button>
                            </div>
                        </div>
                    </div>

                    {itens.length > 0 && (
                        <div>
                            <Typography variant="h6" style={{ marginBottom: '15px', color: '#1976d2' }}>
                                📋 Itens da Venda ({itens.length} {itens.length === 1 ? 'item' : 'itens'})
                            </Typography>
                            
                            <div style={{ overflowX: 'auto' }}>
                                <table className="striped highlight responsive-table">
                                    <thead>
                                        <tr style={{ backgroundColor: '#f5f5f5' }}>
                                            <th style={{ textAlign: 'center' }}>ID</th>
                                            <th>Produto</th>
                                            <th style={{ textAlign: 'center' }}>Valor Unit.</th>
                                            <th style={{ textAlign: 'center' }}>Qtde</th>
                                            <th style={{ textAlign: 'center' }}>quantidadeEstoque</th>
                                            <th style={{ textAlign: 'center' }}>Custo Unit.</th>
                                            <th style={{ textAlign: 'center' }}>Subtotal</th>
                                            <th style={{ textAlign: 'center' }}>Ação</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {itens.map((item, index) => (
                                            <tr key={index} style={{ borderBottom: '1px solid #e0e0e0' }}>
                                                <td style={{ textAlign: 'center', fontWeight: 'bold' }}>
                                                    {item.produto.idProduto}
                                                </td>
                                                <td style={{ fontWeight: 'bold' }}>
                                                    {item.produto.nome}
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={item.precoUnitario}
                                                        onChange={(e) => handleChange(index, 'precoUnitario', e.target.value)}
                                                        style={{ 
                                                            width: '80px', 
                                                            textAlign: 'center',
                                                            border: '1px solid #ddd',
                                                            borderRadius: '4px',
                                                            padding: '5px'
                                                        }}
                                                    />
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={item.quantidade}
                                                        onChange={(e) => handleChange(index, 'quantidade', e.target.value)}
                                                        max={item.produto.quantidadeEstoque || 999999}
                                                        style={{ 
                                                            width: '70px', 
                                                            textAlign: 'center',
                                                            border: '1px solid #ddd',
                                                            borderRadius: '4px',
                                                            padding: '5px'
                                                        }}
                                                    />
                                                </td>
                                                <td style={{ 
                                                    textAlign: 'center', 
                                                    fontWeight: 'bold',
                                                    color: (item.produto.quantidadeEstoque || 0) <= 0 ? '#f44336' : 
                                                           (item.produto.quantidadeEstoque || 0) <= 10 ? '#ff9800' : '#4caf50'
                                                }}>
                                                    {item.produto.quantidadeEstoque !== undefined ? item.produto.quantidadeEstoque : 'N/A'}
                                                    {item.produto.quantidadeEstoque !== undefined && item.produto.quantidadeEstoque <= 10 && item.produto.quantidadeEstoque > 0 && (
                                                        <small style={{ display: 'block', fontSize: '10px' }}>Baixo</small>
                                                    )}
                                                    {item.produto.quantidadeEstoque !== undefined && item.produto.quantidadeEstoque <= 0 && (
                                                        <small style={{ display: 'block', fontSize: '10px' }}>Esgotado</small>
                                                    )}
                                                </td>
                                                <td style={{ textAlign: 'center', color: '#666' }}>
                                                    {item.custoUnitario ? `R$ ${item.custoUnitario.toFixed(2)}` : 'N/A'}
                                                </td>
                                                <td style={{ textAlign: 'center', fontWeight: 'bold', color: '#4caf50' }}>
                                                    R$ {(item.quantidade * item.precoUnitario).toFixed(2)}
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <button 
                                                        className="btn-floating waves-effect waves-light red"
                                                        type="button"
                                                        onClick={() => handleRemoveItem(item)}
                                                        title="Remover item"
                                                    >
                                                        <i className="material-icons">delete</i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {itens.length === 0 && (
                        <Alert severity="info" style={{ marginTop: '20px' }}>
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