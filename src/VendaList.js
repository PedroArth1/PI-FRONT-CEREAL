import React, { useEffect, useState } from "react";
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
                // Toast de erro adaptado para Tailwind
                alert("Erro ao carregar vendas");
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
                alert("Erro ao carregar detalhes");
            });
    };

    useEffect(() => {
        fetchVendas();
    }, []);

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
        <div className="container mx-auto p-4">
            {!novaVendaScreen && !vendaDetalhes && (
                <>
                    <h4 className="text-xl font-bold mb-4">Lista de vendas</h4>
                    
                    {carregando ? (
                        <div className="flex justify-center items-center my-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="py-3 px-4 text-left">ID</th>
                                            <th className="py-3 px-4 text-left">Data</th>
                                            <th className="py-3 px-4 text-left">Total</th>
                                            <th className="py-3 px-4 text-left">Cliente</th>
                                            <th className="py-3 px-4 text-left">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {vendas.map((venda) => (
                                            <tr key={venda.id} className="border-b border-gray-200 hover:bg-gray-50">
                                                <td className="py-3 px-4 font-medium">{venda.id}</td>
                                                <td className="py-3 px-4">{formatarData(venda.data)}</td>
                                                <td className="py-3 px-4">{formatarMoeda(venda.valorTotal)}</td>
                                                <td className="py-3 px-4">{venda.cliente?.nome || "Cliente não informado"}</td>
                                                <td className="py-3 px-4">
                                                    <button
                                                        className="text-blue-600 hover:text-blue-800"
                                                        onClick={() => fetchVendaDetalhes(venda.id)}
                                                        title="Detalhes"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {vendas.length === 0 && !carregando && (
                                <div className="text-center py-8">
                                    <h5 className="text-lg text-gray-500">Nenhuma venda encontrada</h5>
                                </div>
                            )}

                            <button 
                                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded flex items-center"
                                onClick={() => setNovaVendaScreen(true)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
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
                <div className="bg-white rounded-lg shadow-md p-6 mt-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold">Detalhes da Venda #{vendaDetalhes.id}</h3>
                        <button 
                            className="text-gray-500 hover:text-gray-700"
                            onClick={() => setVendaDetalhes(null)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <p><strong>Data:</strong> {formatarData(vendaDetalhes.data)}</p>
                            <p><strong>Total:</strong> {formatarMoeda(vendaDetalhes.valorTotal)}</p>
                        </div>
                        <div>
                            <p><strong>Cliente:</strong> {vendaDetalhes.cliente?.nome || "Não informado"}</p>
                            <p><strong>CPF/CNPJ:</strong> {vendaDetalhes.cliente?.cpfOuCnpj || "Não informado"}</p>
                        </div>
                    </div>
                    
                    <h5 className="font-bold mb-3">Itens da Venda</h5>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-2 px-4 text-left">Produto</th>
                                    <th className="py-2 px-4 text-left">Quantidade</th>
                                    <th className="py-2 px-4 text-left">Preço Unitário</th>
                                    <th className="py-2 px-4 text-left">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vendaDetalhes.itens.map((item, index) => (
                                    <tr key={index} className="border-b border-gray-200">
                                        <td className="py-2 px-4">{item.produto.nome}</td>
                                        <td className="py-2 px-4">{item.quantidade}</td>
                                        <td className="py-2 px-4">{formatarMoeda(item.precoUnitario)}</td>
                                        <td className="py-2 px-4">{formatarMoeda(item.quantidade * item.precoUnitario)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VendaList;