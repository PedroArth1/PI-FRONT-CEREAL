import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Edit, Trash2 } from "lucide-react";
import UserForm from "./UserForm";

const UserList = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/usuarios");
      setUsuarios(response.data);
    } catch (error) {
      showToast("Erro ao buscar usuários", "error");
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleEditar = (usuario) => {
    setUsuarioSelecionado(usuario);
  };

  const handleCancelEdit = () => {
    setUsuarioSelecionado(null);
  };

  const handleExcluir = async (idUsuario) => {
    const confirmar = window.confirm("Tem certeza que deseja excluir este usuário?");
    if (!confirmar) return;

    try {
      await axios.delete(`http://localhost:8080/api/usuarios/${idUsuario}`);
      await fetchUsers();
      showToast("Usuário excluído com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      showToast("Erro ao excluir usuário", "error");
    }
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

      <UserForm
        usuarioSelecionado={usuarioSelecionado}
        onUserAdded={() => {
          fetchUsers();
          setUsuarioSelecionado(null);
        }}
        onCancelEdit={handleCancelEdit}
      />
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mt-8">
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold text-white">Lista de Usuários</h2>
            <span className="ml-auto bg-green-500 text-white px-3 py-1 rounded-full text-sm">
              {usuarios.length} {usuarios.length === 1 ? 'usuário' : 'usuários'}
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
                  Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Senha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Perfil
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usuarios.map((usuario) => (
                <tr key={usuario.idUsuario} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{usuario.nome}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {usuario.login}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {usuario.senha}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {usuario.perfil}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleEditar(usuario)}
                        className="bg-green-100 hover:bg-green-200 text-green-700 p-2 rounded-lg transition-all duration-200"
                        title="Editar usuário"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleExcluir(usuario.idUsuario)}
                        className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-all duration-200"
                        title="Excluir usuário"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {usuarios.length === 0 && (
            <div className="text-center py-8 bg-gray-50">
              <div className="text-gray-500">Nenhum usuário encontrado</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserList;