import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./exploreCategories.module.css";

// Ler credenciais das variáveis de ambiente (prefixo VITE_ para Vite)
const ADZUNA_APP_ID = import.meta.env.VITE_ADZUNA_APP_ID;
const ADZUNA_APP_KEY = import.meta.env.VITE_ADZUNA_APP_KEY;
const TARGET_COUNTRIES = ["br", "pt"]; // Brasil e Portugal

// Lista de tags da Adzuna consideradas como "Tecnologia, Design e Marketing"
const RELEVANT_CATEGORY_TAGS = [
  "it-jobs",
  "engineering-jobs",
  "creative-design-jobs", // Adicionado Design
  "pr-advertising-marketing-jobs", // Adicionado Marketing
];
// Mudei o nome da constante para refletir melhor o conteúdo

// Verificar se as variáveis de ambiente foram carregadas
if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) {
  console.error(
    "Erro: Variáveis de ambiente VITE_ADZUNA_APP_ID ou VITE_ADZUNA_APP_KEY não definidas."
  );
  // Você pode querer mostrar uma mensagem de erro para o usuário aqui
}

function ExploreCategories() {
  // Estado para categorias (agora pode incluir de múltiplos países)
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Erro geral

  useEffect(() => {
    const fetchCategories = async () => {
      if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) {
        setError("Configuração de API ausente.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      let successfulCategories = [];

      try {
        // Busca categorias para cada país
        const promises = TARGET_COUNTRIES.map((countryCode) =>
          fetch(
            `https://api.adzuna.com/v1/api/jobs/${countryCode}/categories?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}`
          )
            .then((response) => {
              if (!response.ok) {
                // Lança erro específico para este país
                throw new Error(
                  `HTTP error fetching categories for ${countryCode}! status: ${response.status}`
                );
              }
              return response.json();
            })
            .then((data) => {
              if (data && Array.isArray(data.results)) {
                return {
                  status: "fulfilled",
                  value: data.results.map((cat) => ({
                    ...cat,
                    country: countryCode,
                    id: `${countryCode}-${cat.tag}`,
                  })),
                };
              } else {
                console.warn(
                  `No categories found or unexpected format for ${countryCode}:`,
                  data
                );
                // Retorna sucesso mas com array vazio se formato for inesperado mas não erro HTTP
                return { status: "fulfilled", value: [] };
              }
            })
            // Captura erro específico da promise deste país
            .catch((error) => ({ status: "rejected", reason: error }))
        );

        // Usar Promise.allSettled para esperar todas, mesmo com rejeições
        const results = await Promise.allSettled(promises);

        results.forEach((result) => {
          if (
            result.status === "fulfilled" &&
            result.value.status === "fulfilled"
          ) {
            // Adiciona categorias de buscas bem-sucedidas
            successfulCategories = successfulCategories.concat(
              result.value.value
            );
          } else if (
            result.status === "fulfilled" &&
            result.value.status === "rejected"
          ) {
            // Erro capturado na promise interna (fetch ou .then)
            console.warn(
              `Falha ao processar categorias para um país: ${result.value.reason}`
            );
          } else if (result.status === "rejected") {
            // Erro na execução da promise (raro aqui, mais provável no .catch interno)
            console.warn(
              `Falha ao buscar categorias para um país: ${result.reason}`
            );
          }
        });

        // FILTRAR as categorias para incluir apenas as RELEVANTES
        const relevantCategories = successfulCategories.filter(
          (category) => RELEVANT_CATEGORY_TAGS.includes(category.tag) // Usar a nova lista
        );

        // Atualizar mensagens de erro/log
        if (
          relevantCategories.length === 0 &&
          successfulCategories.length > 0
        ) {
          console.log(
            "Categorias encontradas, mas nenhuma corresponde ao filtro relevante (TI, Eng, Design, Mkt)."
          );
          // setError("Nenhuma categoria relevante encontrada.");
        } else if (
          relevantCategories.length === 0 &&
          results.some(
            (r) =>
              r.status === "rejected" ||
              (r.status === "fulfilled" && r.value.status === "rejected")
          )
        ) {
          setError(
            "Falha ao carregar categorias de um ou mais países. Verifique o console."
          );
        } else if (relevantCategories.length === 0) {
          console.log(
            "Nenhuma categoria relevante encontrada nos países consultados."
          );
        }

        if (relevantCategories.length > 0) {
          relevantCategories.sort((a, b) => a.label.localeCompare(b.label));
        }

        // Define o estado com as categorias JÁ FILTRADAS
        setCategories(relevantCategories);
      } catch (e) {
        // Erro geral na execução do try/catch (inesperado)
        console.error("Erro inesperado ao buscar categorias da Adzuna:", e);
        setError(e.message || "Ocorreu um erro inesperado.");
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className={styles.exploreSection}>
      <h2 className={styles.title}>
        Explore por <span className={styles.titleHighlight}>Categorias</span>
      </h2>
      {loading && <p>Carregando categorias...</p>}
      {/* Mostra erro geral se houver */}
      {error && <p className={styles.error}>Erro: {error}</p>}
      {!loading && !error && (
        <div className={styles.gridContainer}>
          {categories.length > 0
            ? categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/categoria/adzuna/${category.country}/${category.tag}`}
                  state={{
                    categoryName: category.label,
                    countryCode: category.country,
                  }}
                  className={styles.categoryLink}
                >
                  <div className={styles.categoryCard}>
                    <h3>{category.label}</h3>
                    <span className={styles.countryIndicator}>
                      {category.country.toUpperCase()}
                    </span>
                  </div>
                </Link>
              ))
            : // Mensagem se não estiver carregando, sem erro GERAL, mas sem categorias
              !loading &&
              !error && (
                <p>
                  Nenhuma categoria relevante (TI, Engenharia, Design,
                  Marketing) encontrada.
                </p>
              )}
        </div>
      )}
    </section>
  );
}

export default ExploreCategories;
