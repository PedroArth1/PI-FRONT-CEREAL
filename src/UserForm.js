import React, { useEffect, useState } from "react";
import axios from "axios";
import { Check, X } from "lucide-react";

const UserForm = ({ usuarioSelecionado, onUserAdded, onCancelEdit }) => {
  const [idUsuario, setIdUsuario] = useState(null);
  const [nome, setNome] = useState("");
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [perfil, setPerfil] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    if (usuarioSelecionado) {
      setIdUsuario(usuarioSelecionado.idUsuario);
      setNome(usuarioSelecionado.nome);
      setLogin(usuarioSelecionado.login);
      setSenha(usuarioSelecionado.senha);
      setPerfil(usuarioSelecionado.perfil);
    } else {
      limparCampos();
    }
  }, [usuarioSelecionado]);

  const limparCampos = () => {
    setIdUsuario(null);
    setNome("");
    setLogin("");
    setSenha("");
    setPerfil("");
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (idUsuario) {
        await axios.put(`http://localhost:8080/api/usuarios/${idUsuario}`, {
          nome,
          login,
          senha,
          perfil,
        });
        showToast("Usuário atualizado com sucesso!", "success");
      } else {
        await axios.post("http://localhost:8080/api/usuarios", {
          nome,
          login,
          senha,
          perfil,
        });
        showToast("Usuário cadastrado com sucesso!", "success");
      }
      limparCampos();
      if (onUserAdded) onUserAdded();
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      const errorMessage = error.response?.data?.message || "Erro ao salvar usuário";
      showToast(errorMessage, "error");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      {/* Toast Notification */}
      {toast.show && (
        <div 
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg text-white ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          } transition-opacity duration-300 flex items-center`}
        >
          {toast.type === "success" ? (
            <Check className="mr-2" />
          ) : (
            <X className="mr-2" />
          )}
          {toast.message}
        </div>
      )}

      <h3 className="text-xl font-bold text-gray-800 mb-4">
        {idUsuario ? "Editar Usuário" : "Cadastrar Novo Usuário"}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="block px-4 py-3 w-full text-gray-700 bg-gray-50 rounded-lg border border-gray-300 focus:ring-green-500 focus:border-green-500 peer"
            placeholder=" "
          />
          <label 
            htmlFor="nome" 
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-3 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-green-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-3 peer-focus:scale-75 peer-focus:-translate-y-4 left-4 bg-white"
          >
            Nome
          </label>
        </div>
        
        <div className="relative">
          <input
            id="login"
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
            className="block px-4 py-3 w-full text-gray-700 bg-gray-50 rounded-lg border border-gray-300 focus:ring-green-500 focus:border-green-500 peer"
            placeholder=" "
          />
          <label 
            htmlFor="login" 
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-3 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-green-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-3 peer-focus:scale-75 peer-focus:-translate-y-4 left-4 bg-white"
          >
            Login
          </label>
        </div>
        
        <div className="relative">
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            className="block px-4 py-3 w-full text-gray-700 bg-gray-50 rounded-lg border border-gray-300 focus:ring-green-500 focus:border-green-500 peer"
            placeholder=" "
          />
          <label 
            htmlFor="senha" 
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-3 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-green-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-3 peer-focus:scale-75 peer-focus:-translate-y-4 left-4 bg-white"
          >
            Senha
          </label>
        </div>
        
        <div className="relative">
          <select
            id="perfil"
            value={perfil}
            onChange={(e) => setPerfil(e.target.value)}
            required
            className="block px-4 py-3 w-full text-gray-700 bg-gray-50 rounded-lg border border-gray-300 focus:ring-green-500 focus:border-green-500 appearance-none"
          >
            <option value="" disabled>Selecione o perfil</option>
            <option value="GERENTE">GERENTE</option>
            <option value="OPERADOR">OPERADOR</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
          <label 
            htmlFor="perfil" 
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-3 z-10 origin-[0] px-2 left-4 bg-white"
          >
            Perfil
          </label>
        </div>
        
        <div className="flex space-x-3 pt-2">
          <button
            type="submit"
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
          >
            {idUsuario ? "Atualizar Usuário" : "Cadastrar Usuário"}
          </button>
          
          {idUsuario && (
            <button
              type="button"
              onClick={() => {
                limparCampos();
                if (onCancelEdit) onCancelEdit();
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default UserForm;