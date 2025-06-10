import React, { useEffect, useState } from "react";
import axios from "axios";
import M from "materialize-css";
import UserForm from "./UserForm";

const UserList = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);

  const fetchUsers = async () => {
    const response = await axios.get("http://localhost:8080/api/usuarios");
    setUsuarios(response.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditar = (usuario) => {
    setUsuarioSelecionado(usuario);
  };
  
  const handleCancelEdit = () => {
    setUsuarioSelecionado(null);
  };

  const handleExcluir = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/usuarios/${id}`);
      await fetchUsers();
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      M.toast({ html: "Erro ao excluir usuário", classes: "red" });
    }
  };

  return (
    <div className="container">
      <UserForm
        usuarioSelecionado={usuarioSelecionado}
        onUserAdded={() => {
          fetchUsers();
          setUsuarioSelecionado(null);
        }}
        onCancelEdit={handleCancelEdit}
      />
      <h4>Lista de Usuários</h4>
      <table className="striped highlight responsive-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Login</th>
            <th>Senha</th>
            <th>Perfil</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td><strong>{usuario.nome}</strong></td>
              <td>{usuario.login}</td>
              <td>{usuario.senha}</td>
              <td>{usuario.perfil}</td>
              <td>
                <button
                  className="btn-flat"
                  onClick={() => handleEditar(usuario)}
                  title="Editar"
                >
                  <i className="material-icons text-darken-2">edit</i>
                </button>
                <button
                  className="btn-flat"
                  onClick={() => handleExcluir(usuario.id)}
                  title="Excluir"
                >
                  <i className="material-icons text-darken-2">delete</i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;

