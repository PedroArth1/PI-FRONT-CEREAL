import React, { useState } from "react";
import { 
  Users, 
  Package, 
  ShoppingCart, 
  User,
  Wheat 
} from "lucide-react";

import PessoaForm from "./ClienteForm";
import UserList from "./UserList";
import PessoaList from "./ClienteList";
import ProdutoList from "./ProdutoList";
import VendaList from "./VendaList";

function App() {
  const [updateList, setUpdateList] = useState(false);
  const [activeScreen, setActiveScreen] = useState("cliente");
  const [clienteParaEditar, setClienteParaEditar] = useState(null);

  const handleScreenChange = (screen) => {
    // Limpar estados de edição ao trocar de tela
    setClienteParaEditar(null);
    
    if (activeScreen === screen) {
      setUpdateList((prev) => !prev);
    } else {
      setActiveScreen(screen);
    }
  };

  const menuItems = [
    { id: "cliente", label: "Clientes", icon: Users },
    { id: "produto", label: "Produtos", icon: Package },
    { id: "venda", label: "Vendas", icon: ShoppingCart },
    { id: "usuario", label: "Usuários", icon: User },
  ];

  const renderContent = () => {
    switch (activeScreen) {
      case "cliente":
        return (
          <>
            <PessoaForm
              onUserAdded={() => setUpdateList(!updateList)}
              clienteParaEditar={clienteParaEditar}
              setClienteParaEditar={setClienteParaEditar}
            />
            <PessoaList
              key={updateList}
              onEdit={(cliente) => {
                setClienteParaEditar(cliente);
                setActiveScreen("cliente");
              }}
            />
          </>
        );
      case "produto":
        return (
          <ProdutoList
            key={updateList}
            updateTrigger={updateList}
          />
        );
      case "usuario":
        return <UserList key={updateList} />;
      case "venda":
        return <VendaList key={updateList} init={updateList} />;
      default:
        return null;
    }
  };

  const getScreenTitle = () => {
    const titles = {
      cliente: "Clientes",
      produto: "Produtos", 
      venda: "Vendas",
      usuario: "Usuários"
    };
    return titles[activeScreen] || activeScreen;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg fixed h-full z-10">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <Wheat className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">Sistema Cerealista</h1>
              <p className="text-sm text-gray-600">Gestão Completa</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="px-4 py-6">
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 px-2">
              Menu Principal
            </h3>
          </div>
          
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeScreen === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleScreenChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-all duration-200 group border-0 outline-none ${
                    isActive 
                      ? "bg-green-600 text-white" 
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              {getScreenTitle()}
            </h2>
          </div>
        </div>

        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default App;