import React, { useEffect, useState } from "react";
import axios from "axios";
import M from "materialize-css";

const UserForm = ({ usuarioSelecionado, onUserAdded, onCancelEdit }) => {
  const [id, setId] = useState(null);
  const [nome, setNome] = useState("");
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [perfil, setPerfil] = useState("");


  useEffect(() => {
    if (usuarioSelecionado) {
      setId(usuarioSelecionado.id);
      setNome(usuarioSelecionado.nome);
      setLogin(usuarioSelecionado.login);
      setSenha(usuarioSelecionado.senha);
      setPerfil(usuarioSelecionado.perfil);
      setTimeout(() => M.updateTextFields(), 0); // Atualiza labels
    } else {
      limparCampos();
    }
  }, [usuarioSelecionado]);

  const limparCampos = () => {
    setId(null);
    setNome("");
    setLogin("");
    setSenha("");
    setPerfil("");
    // Limpa os campos do formulário

    setTimeout(() => M.updateTextFields(), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/usuario", {
        id,
        nome,
        login,
        senha,
        perfil,
      });
      M.toast({ html: "Usuário salvo com sucesso!", classes: "green" });
      limparCampos();
      onUserAdded();
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      M.toast({ html: "Erro ao salvar usuário", classes: "red" });
    }
  };

  return (
    <div>
      <h4>{id ? "Editar Usuário" : "Cadastrar Usuário"}</h4>
      <form onSubmit={handleSubmit}>
        <div className="input-field">
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <label htmlFor="nome">Nome</label>
        </div>
        <div className="input-field">
          <input
            id="login"
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
          />
          <label htmlFor="login">Login</label>
        </div>
        <div className="input-field">
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <label htmlFor="senha">Senha</label>
        </div>
        <div className="input-field">
          <input
            id="perfil"
            type="password"
            value={perfil}
            onChange={(e) => setPerfil(e.target.value)}
            required
          />
          <label htmlFor="perfil">Perfil</label>
        </div>
        <button className="btn waves-effect waves-light" type="submit">
          {id ? "Atualizar" : "Cadastrar"}
        </button>
        {id && (
          <button
            type="button"
            className="btn-flat red-text"
            onClick={() => {
              limparCampos();
              onCancelEdit();
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
