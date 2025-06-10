import React, { useEffect, useState } from "react";
import axios from "axios";
import M from "materialize-css";

const UserForm = ({ usuarioSelecionado, onUserAdded, onCancelEdit }) => {
  const [idUsuario, setIdUsuario] = useState(null);
  const [nome, setNome] = useState("");
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [perfil, setPerfil] = useState("");

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
    setTimeout(() => M.updateTextFields(), 0);
    // eslint-disable-next-line
  }, [usuarioSelecionado]);

  const limparCampos = () => {
    setIdUsuario(null);
    setNome("");
    setLogin("");
    setSenha("");
    setPerfil("");
    setTimeout(() => M.updateTextFields(), 0);
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
        M.toast({ html: "Usuário atualizado com sucesso!", classes: "green" });
      } else {
        await axios.post("http://localhost:8080/api/usuarios", {
          nome,
          login,
          senha,
          perfil,
        });
        M.toast({ html: "Usuário cadastrado com sucesso!", classes: "green" });
      }
      limparCampos();
      if (onUserAdded) onUserAdded();
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      M.toast({
        html: error.response?.data?.message || "Erro ao salvar usuário",
        classes: "red",
      });
    }
  };

  return (
    <div>
      <h4>{idUsuario ? "Editar Usuário" : "Cadastrar Usuário"}</h4>
      <form onSubmit={handleSubmit}>
        <div className="input-field">
          <input
            idUsuario="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <label htmlFor="nome" className={nome ? "active" : ""}>Nome</label>
        </div>
        <div className="input-field">
          <input
            idUsuario="login"
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
          />
          <label htmlFor="login" className={login ? "active" : ""}>Login</label>
        </div>
        <div className="input-field">
          <input
            idUsuario="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <label htmlFor="senha" className={senha ? "active" : ""}>Senha</label>
        </div>
        <div className="input-field">
          <select
            idUsuario="perfil"
            className="browser-default"
            value={perfil}
            onChange={(e) => setPerfil(e.target.value)}
            required
          >
            <option value="" disabled>Selecione o perfil</option>
            <option value="GERENTE">GERENTE</option>
            <option value="OPERADOR">OPERADOR</option>
          </select>
          <label className="active" htmlFor="perfil">Perfil</label>
        </div>
        <button className="btn waves-effect waves-light" type="submit">
          {idUsuario ? "Atualizar" : "Cadastrar"}
        </button>
        {idUsuario && (
          <button
            type="button"
            className="btn-flat red-text"
            onClick={() => {
              limparCampos();
              if (onCancelEdit) onCancelEdit();
            }}
            style={{ marginLeft: "10px" }}
          >
            Cancelar Edição
          </button>
        )}
      </form>
    </div>
  );
};

export default UserForm;