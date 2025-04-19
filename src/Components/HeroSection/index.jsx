import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./heroSection.module.css";
import { FaSearch } from "react-icons/fa";

function HeroSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault(); // Impede o envio padrão do formulário
    
    // Montar os query parameters, garantindo que estão URL-encoded
    const queryParams = new URLSearchParams();
    if (searchTerm) {
      queryParams.set("what", searchTerm);
    }
    if (location) {
      queryParams.set("where", location);
    }

    // Navegar para a página de resultados com os parâmetros
    navigate(`/search-results?${queryParams.toString()}`);
  };

  return (
    <div className={styles.heroContainer}>
      <div className={styles.overlay}></div>{" "}
      {/* Camada para escurecer o fundo */}
      <div className={styles.content}>
        <h1 className={styles.title}>+500.000</h1>
        <p className={styles.subtitle}>
          vagas recentes dos melhores sites de empregos e empresas
        </p>

        {/* Adiciona a área de busca com label */}
        <div className={styles.searchArea}>
          <span className={styles.searchAreaLabel}>Procurar Vagas</span>
          <form className={styles.searchForm} onSubmit={handleSearch}>
            <div className={styles.inputGroup}>
              {/* Label escondida, mas input tem aria-label */}
              {/* <label htmlFor="search-term">O quê?</label> */}
              <input
                type="text"
                id="search-term"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="emprego, empresa, função"
                aria-label="O quê?"
              />
              {/* Ícone via CSS ::before */}
            </div>
            <div className={styles.inputGroup}>
              {/* <label htmlFor="location">Onde?</label> */}
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="cidade ou CEP"
                aria-label="Onde?"
              />
              {/* Ícone via CSS ::before */}
            </div>
            <button type="submit" className={styles.searchButton}>
              <FaSearch />  Encontrar vagas
            </button>            
          </form>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
