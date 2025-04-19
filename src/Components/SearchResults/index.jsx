import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import style from "./searchResults.module.css";

// Ler credenciais das variáveis de ambiente
const ADZUNA_APP_ID = import.meta.env.VITE_ADZUNA_APP_ID;
const ADZUNA_APP_KEY = import.meta.env.VITE_ADZUNA_APP_KEY;

// Verificar se as variáveis de ambiente foram carregadas
if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) {
  console.error(
    "Erro: Variáveis de ambiente VITE_ADZUNA_APP_ID ou VITE_ADZUNA_APP_KEY não definidas."
  );
  // Considerar lançar um erro ou mostrar uma mensagem mais visível ao usuário
}

export default function SearchResults() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("what") || ""; // "O quê"
  const searchLocation = queryParams.get("where") || ""; // "Onde"
  const countryCode = "br"; // Fixo em Brasil por enquanto

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) {
      setError("Configuração de API ausente.");
      setLoading(false);
      return;
    }

    // Se não há termos de busca, não faz sentido buscar
    if (!searchTerm && !searchLocation) {
      setError("Por favor, informe um termo ou localidade para buscar.");
      setLoading(false);
      return;
    }

    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      setJobs([]); // Limpa vagas anteriores

      try {
        // Monta a URL da API de busca da Adzuna com 'what' e 'where'
        // Nota: A API Adzuna pode não funcionar bem apenas com 'where' sem 'what',
        // ou vice-versa, dependendo da localidade.
        const apiUrl = `https://api.adzuna.com/v1/api/jobs/${countryCode}/search/1?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}&results_per_page=50&what=${encodeURIComponent(
          searchTerm
        )}&where=${encodeURIComponent(
          searchLocation
        )}&content-type=application/json`;

        console.log(
          `Buscando vagas Adzuna com: what="${searchTerm}", where="${searchLocation}" em ${apiUrl}`
        );

        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(
            `Erro HTTP ao buscar vagas Adzuna! status: ${response.status}`
          );
        }

        const data = await response.json();

        if (data && Array.isArray(data.results)) {
          if (data.results.length === 0) {
            setError(
              `Nenhuma vaga encontrada para "${searchTerm}" ${
                searchLocation ? `em "${searchLocation}"` : ""
              }. Tente termos diferentes.`
            );
          } else {
            setJobs(data.results);
          }
        } else {
          console.warn("Formato inesperado da resposta da API Adzuna:", data);
          setError("Formato de resposta inesperado da API Adzuna.");
        }
      } catch (e) {
        console.error("Erro ao buscar vagas da Adzuna:", e);
        setError(e.message || "Ocorreu um erro ao buscar as vagas.");
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
    // Dependências: re-busca se os parâmetros da URL mudarem
  }, [searchTerm, searchLocation, countryCode]); // Adicionado countryCode, embora fixo

  return (
    <div className={style.searchResults}>
      <h2 className={style.resultsTitle}>
        Resultados da busca para: "{searchTerm}"{" "}
        {searchLocation ? `em "${searchLocation}"` : ""} (BR)
      </h2>

      {loading && (
        <p className={style.statusMessage}>Carregando resultados...</p>
      )}

      {error && (
        <p className={`${style.errorText} ${style.statusMessage}`}>{error}</p>
      )}

      {!loading && !error && jobs.length > 0 && (
        <ul className={style.resultsList}>
          {jobs.map((job) => (
            <li className={style.resultsItem} key={job.id}>
              <div>
                <a
                  className={style.resultsLink}
                  href={job.redirect_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={job.description}
                >
                  {job.title}
                </a>
              </div>
              <span className={style.companyName}>
                {job.company?.display_name} - {job.location?.display_name}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* Nenhuma mensagem explícita para "jobs.length === 0 && !error" pois o estado de erro já cobre isso */}
    </div>
  );
}
