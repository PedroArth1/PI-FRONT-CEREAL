import React, { useEffect, useState } from "react";
import axios from "axios";


const ClienteList = () => {
  const [clientes, setClientes] = useState([]);

  const fetchClientes= async () => {
    const response = await axios.get("http://localhost:8080/api/clientes");
    setClientes(response.data);
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  return (
    <div className="container">
      <h4>Lista de clientes</h4>
      <ul className="collection">
        {clientes.map((cliente) => (
          <li key={cliente.id} className="collection-item">
            <strong>{cliente.nome}</strong> - {cliente.cpfOuCnpj} - {cliente.telefone} - {cliente.endereco}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClienteList;

