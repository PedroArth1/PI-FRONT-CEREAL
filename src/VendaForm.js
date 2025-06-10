import React, { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
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
            const item = {
                produto,
                precoUnitario: produto.preco,
                custoUnitario: produto.precoCusto || null,
                quantidade: 1,
            };
            setItens([...itens, item]);
            setProduto(null);
            setProdutoInputValue("");
        }
    }

    const handleRemoveItem = (item) => {
        if (item) {
            const newItens = itens.filter(itemR => itemR.produto.idProduto !== item.produto.idProduto);
            setItens(newItens);
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
            novosItens[index].quantidade = parseFloat(valor) || 0;
        }

        setItens(novosItens);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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

            await axios.post("http://localhost:8080/api/vendas", venda)
                .then((response) => {
                    M.toast({ html: "Venda realizada com sucesso!", classes: "green" });
                    // Resetar formulário após sucesso
                    setCliente(null);
                    setClienteInputValue("");
                    setItens([]);
                    setValorTotal(0.0);
                })
                .catch((error) => {
                    console.log("Erro na requisição:", error.response?.data || error.message);
                    M.toast({ html: "Erro ao efetuar venda", classes: "red" });
                });

        } catch (error) {
            console.error("Erro ao efetuar venda:", error);
            M.toast({ html: "Erro ao efetuar venda", classes: "red" });
        }
    };

    return (
        <div className="container">
            <h4>Lançamento de venda</h4>
            <form onSubmit={handleSubmit}>
                <div className="input-field">
                    Data da venda:
                    <input 
                        type="date" 
                        value={dataVenda}
                        onChange={(e) => setDataVenda(e.target.value)}
                        required
                    />
                </div>

                <div className="input-field">
                    Total da venda:
                    <input 
                        type="text" 
                        value={valorTotal.toFixed(2)} 
                        disabled={true} 
                    />
                </div>

                <div className="input-field">
                    Cliente:
                    <Autocomplete
                        value={cliente}
                        onChange={(event, newValue) => setCliente(newValue)}
                        inputValue={clienteInputValue}
                        onInputChange={(event, newInputValue) => setClienteInputValue(newInputValue)}
                        options={clientesLike}
                        noOptionsText="Sem registros"
                        getOptionLabel={(option) => option?.nome || ""}
                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
                        renderInput={(params) => (
                            <TextField 
                                {...params} 
                                variant="standard"
                                placeholder="Selecione um cliente"
                                InputProps={{
                                    ...params.InputProps,
                                    disableUnderline: true,
                                }} 
                            />
                        )}
                        renderOption={(props, option) => (
                            <li {...props} key={option?.id}>
                                {option?.nome} - {option?.cpfOuCnpj}
                            </li>
                        )}
                    />
                </div>

                <div style={{ marginTop: '20px' }}>
                    <button className="btn waves-effect waves-light" type="submit">
                        Salvar
                    </button>
                    <button
                        className="btn waves-effect waves-light red"
                        onClick={onCancel}
                        style={{ marginLeft: '10px' }}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
            
            <hr />
            
            <div className="input-field">
                Produto:
                <Autocomplete
                    value={produto}
                    onChange={(event, newValue) => setProduto(newValue)}
                    inputValue={produtoInputValue}
                    onInputChange={(event, newInputValue) => setProdutoInputValue(newInputValue)}
                    options={produtosLike}
                    noOptionsText="Sem registros"
                    getOptionLabel={(option) => option?.nome || ""}
                    isOptionEqualToValue={(option, value) => option?.idProduto === value?.idProduto}
                    renderInput={(params) => (
                        <TextField 
                            {...params} 
                            variant="standard"
                            placeholder="Selecione um produto"
                            InputProps={{
                                ...params.InputProps,
                                disableUnderline: true,
                            }}
                        />
                    )}
                    renderOption={(props, option) => (
                        <li {...props} key={option?.idProduto}>
                            {option?.nome} - R$ {option?.preco.toFixed(2)}
                        </li>
                    )}
                />
                <button 
                    className="btn waves-effect waves-light"
                    onClick={handleAddItem}
                    disabled={!produto}
                    style={{ marginTop: '10px' }}
                >
                    Adicionar
                </button>
            </div>

            <table className="striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Produto</th>
                        <th>Valor UN</th>
                        <th>Quantidade</th>
                        <th>Custo UN</th>
                        <th>Subtotal</th>
                        <th>Remover</th>
                    </tr>
                </thead>
                <tbody>
                    {itens.map((item, index) => (
                        <tr key={index}>
                            <td>{item.produto.idProduto}</td>
                            <td>{item.produto.nome}</td>
                            <td>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={item.precoUnitario}
                                    onChange={(e) => handleChange(index, 'precoUnitario', e.target.value)}
                                    style={{ width: '80px' }}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={item.quantidade}
                                    onChange={(e) => handleChange(index, 'quantidade', e.target.value)}
                                    style={{ width: '80px' }}
                                />
                            </td>
                            <td>
                                {item.custoUnitario ? item.custoUnitario.toFixed(2) : 'N/A'}
                            </td>
                            <td>{(item.quantidade * item.precoUnitario).toFixed(2)}</td>
                            <td>
                                <button 
                                    className="btn-floating waves-effect waves-light red"
                                    onClick={() => handleRemoveItem(item)}
                                >
                                    <i className="material-icons">delete</i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default VendaForm;