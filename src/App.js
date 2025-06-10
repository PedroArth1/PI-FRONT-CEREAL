import React, { useState, useEffect } from "react";
import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
import "materialize-css/dist/js/materialize.min.js";

import PessoaForm from "./ClienteForm";
import ProdutoForm from "./ProdutoForm";
import UserList from "./UserList";
import PessoaList from "./ClienteList";
import ProdutoList from "./ProdutoList";
import VendaList from "./VendaList";

function App() {
  const [updateList, setUpdateList] = useState(false);
  const [activeScreen, setActiveScreen] = useState("usuario");

  useEffect(() => {
    const elems = document.querySelectorAll(".sidenav");
    M.Sidenav.init(elems);
  }, []);

  const handleScreenChange = (screen) => {
    if (activeScreen === screen) {
      setUpdateList((prev) => !prev);
    } else {
      setActiveScreen(screen);
    }
  };

  const renderContent = () => {
    switch (activeScreen) {
      case "pessoa":
        return (
          <>
            <PessoaForm onUserAdded={() => setUpdateList(!updateList)} />
            <PessoaList key={updateList} />
          </>
        );
      case "produto":
        return (
          <>
            <ProdutoForm onUserAdded={() => setUpdateList(!updateList)} />
            <ProdutoList key={updateList} />
          </>
        );
      case "usuario":
        return (
          <>
            <UserList key={updateList} />
          </>
        );
      case "venda":
        return (
          <>
            <VendaList key={updateList} init={updateList} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <nav>
        <div className="nav-wrapper blue">
          <div className="brand-logo center">UNIPAR</div>
        </div>
      </nav>

      <ul id="slide-out" className="sidenav sidenav-fixed">
        <li>
          <div className="user-view">MENU</div>
        </li>
        <li>
          <a href="#!" onClick={() => handleScreenChange("pessoa")}>
            Cadastro de Pessoa
          </a>
        </li>
        <li>
          <a href="#!" onClick={() => handleScreenChange("produto")}>
            Cadastro de Produto
          </a>
        </li>
        <li>
          <a href="#!" onClick={() => handleScreenChange("usuario")}>
            Cadastro de Usuário
          </a>
        </li>
        <li>
          <a href="#!" onClick={() => handleScreenChange("venda")}>
            Efetuar Venda
          </a>
        </li>
        <li>
          <div className="divider"></div>
        </li>
        <li>
          <a href="#!" onClick={() => alert("Relatórios")}>
            Relatórios
          </a>
        </li>
      </ul>

      <main style={{ marginLeft: 300, padding: 20 }}>{renderContent()}</main>
    </div>
  );
}

export default App;
