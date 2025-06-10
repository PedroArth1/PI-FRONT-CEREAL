import React, { useEffect, useState } from "react";
import M from "materialize-css";
import axios from "axios";
import VendaForm from "./VendaForm";

const VendaList = () => {
    const [novaVendaScreen, setNovaVendaScreen] = useState(false);
    const [vendas, setVendas] = useState([]);
    const [vendaDetalhes, setVendaDetalhes] = useState(null);
    const [carregando, setCarregando] = useState(true);

    const fetchVendas = () => {
        setCarregando(true);
        axios.get("http://localhost:8080/api/vendas")
            .then((response) => {
                setVendas(response.data);
                setCarregando(false);
            })
            .catch((error) => {
                console.error("Erro ao buscar vendas:", error);
                setCarregando(false);
                M.toast({ html: "Erro ao carregar vendas", classes: "red" });
            });
    };

    const fetchVendaDetalhes = (id) => {
        setCarregando(true);
        axios.get(`http://localhost:8080/api/vendas/${id}`)
            .then((response) => {
                setVendaDetalhes(response.data);
                setCarregando(false);
            })
            .catch((error) => {
                console.error("Erro ao buscar detalhes da venda:", error);
                setCarregando(false);
                M.toast({ html: "Erro ao carregar detalhes", classes: "red" });
            });
    };

    useEffect(() => {
        fetchVendas();
        M.AutoInit(); // Inicializa componentes do Materialize
    }, []);

    const handleExcluir = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir esta venda?")) {
            try {
                await axios.delete(`http://localhost:8080/api/vendas/${id}`);
                fetchVendas();
                M.toast({ html: "Venda excluída com sucesso", classes: "green" });
            } catch (error) {
                console.error("Erro ao excluir venda:", error);
                M.toast({ html: "Erro ao excluir venda", classes: "red" });
            }
        }
    };

    const formatarData = (dataString) => {
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR');
    };

    const formatarMoeda = (valor) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };

    return (
        <div className="container">
            {!novaVendaScreen && !vendaDetalhes && (
                <>
                    <h4>Lista de vendas</h4>
                    
                    {carregando ? (
                        <div className="center-align" style={{ margin: '20px 0' }}>
                            <div className="preloader-wrapper big active">
                                <div className="spinner-layer spinner-blue-only">
                                    <div className="circle-clipper left">
                                        <div className="circle"></div>
                                    </div>
                                    <div className="gap-patch">
                                        <div className="circle"></div>
                                    </div>
                                    <div className="circle-clipper right">
                                        <div className="circle"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <table className="striped highlight responsive-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Data</th>
                                        <th>Total</th>
                                        <th>Cliente</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vendas.map((venda) => (
                                        <tr key={venda.id}>
                                            <td><strong>{venda.id}</strong></td>
                                            <td>{formatarData(venda.data)}</td>
                                            <td>{formatarMoeda(venda.valorTotal)}</td>
                                            <td>{venda.cliente?.nome || "Cliente não informado"}</td>
                                            <td>
                                                <button
                                                    className="btn-flat blue-text"
                                                    onClick={() => fetchVendaDetalhes(venda.id)}
                                                    title="Detalhes"
                                                >
                                                    <i className="material-icons">visibility</i>
                                                </button>
                                                <button
                                                    className="btn-flat red-text"
                                                    onClick={() => handleExcluir(venda.id)}
                                                    title="Excluir"
                                                >
                                                    <i className="material-icons">delete</i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {vendas.length === 0 && !carregando && (
                                <div className="center-align" style={{ margin: '20px 0' }}>
                                    <h5>Nenhuma venda encontrada</h5>
                                </div>
                            )}

                            <button 
                                className="btn waves-effect waves-light"
                                onClick={() => setNovaVendaScreen(true)}
                                style={{ marginTop: '20px' }}
                            >
                                <i className="material-icons left">add</i>
                                Nova venda
                            </button>
                        </>
                    )}
                </>
            )}

            {novaVendaScreen && (
                <VendaForm 
                    onCancel={() => setNovaVendaScreen(false)}
                    onVendaRealizada={() => {
                        setNovaVendaScreen(false);
                        fetchVendas();
                    }}
                />
            )}

            {vendaDetalhes && !novaVendaScreen && (
                <div className="card">
                    <div className="card-content">
                        <span className="card-title">
                            Detalhes da Venda #{vendaDetalhes.id}
                            <button 
                                className="btn-flat right"
                                onClick={() => setVendaDetalhes(null)}
                            >
                                <i className="material-icons">close</i>
                            </button>
                        </span>
                        
                        <div className="row">
                            <div className="col s6">
                                <p><strong>Data:</strong> {formatarData(vendaDetalhes.data)}</p>
                                <p><strong>Total:</strong> {formatarMoeda(vendaDetalhes.valorTotal)}</p>
                            </div>
                            <div className="col s6">
                                <p><strong>Cliente:</strong> {vendaDetalhes.cliente?.nome || "Não informado"}</p>
                                <p><strong>CPF/CNPJ:</strong> {vendaDetalhes.cliente?.cpfOuCnpj || "Não informado"}</p>
                            </div>
                        </div>
                        
                        <h5>Itens da Venda</h5>
                        <table className="striped">
                            <thead>
                                <tr>
                                    <th>Produto</th>
                                    <th>Quantidade</th>
                                    <th>Preço Unitário</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vendaDetalhes.itens.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.produto.nome}</td>
                                        <td>{item.quantidade}</td>
                                        <td>{formatarMoeda(item.precoUnitario)}</td>
                                        <td>{formatarMoeda(item.quantidade * item.precoUnitario)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        <div className="right-align" style={{ marginTop: '20px' }}>
                            <button 
                                className="btn waves-effect waves-light red"
                                onClick={() => handleExcluir(vendaDetalhes.id)}
                            >
                                <i className="material-icons left">delete</i>
                                Excluir Venda
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VendaList;