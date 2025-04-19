import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import style from "./category.module.css";

// Ler credenciais das variáveis de ambiente
const ADZUNA_APP_ID = import.meta.env.VITE_ADZUNA_APP_ID;
const ADZUNA_APP_KEY = import.meta.env.VITE_ADZUNA_APP_KEY;

// Verificar se as variáveis de ambiente foram carregadas
if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) {
  console.error(
    "Erro: Variáveis de ambiente VITE_ADZUNA_APP_ID ou VITE_ADZUNA_APP_KEY não definidas."
  );
}

export default function Category() {
  // Pegar parâmetros da nova rota
  const { countryCode, categoryTag } = useParams();
  const location = useLocation();
  // Pegar nome da categoria do estado da rota, fallback para a tag
  const categoryName = location.state?.categoryName || categoryTag;
  const displayCountry = (countryCode || "").toUpperCase(); // Para exibir BR ou PT

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState(""); // Estado para o input de filtro

  useEffect(() => {
    if (!countryCode || !categoryTag) {
      // Se não temos país ou tag, provavelmente é um estado inválido
      setError("Parâmetros de categoria ou país ausentes.");
      setLoading(false);
      return;
    }
    if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) {
      setError("Configuração de API ausente.");
      setLoading(false);
      return;
    }

    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      setJobs([]); // Limpa vagas anteriores ao iniciar busca

      try {
        // Monta a URL da API de busca da Adzuna
        const apiUrl = `https://api.adzuna.com/v1/api/jobs/${countryCode}/search/1?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}&results_per_page=50&category=${categoryTag}&content-type=application/json`;

        console.log(
          `Buscando vagas Adzuna para: ${categoryTag} (${countryCode}) em ${apiUrl}`
        );

        const response = await fetch(apiUrl);

        if (!response.ok) {
          // Adzuna pode retornar erros no corpo JSON mesmo com status 200,
          // mas tratamos erros HTTP primeiro.
          throw new Error(
            `Erro HTTP ao buscar vagas Adzuna! status: ${response.status}`
          );
        }

        const data = await response.json();

        // Verifica se a resposta contém a chave 'results' e é um array
        if (data && Array.isArray(data.results)) {
          if (data.results.length === 0) {
            // Nenhuma vaga encontrada para esta categoria/país
            setError(
              `Nenhuma vaga encontrada para "${categoryName}" em ${displayCountry}.`
            );
          } else {
            // Adzuna retorna ID numérico, vamos usar ele
            setJobs(data.results);
          }
        } else {
          console.warn("Formato inesperado da resposta da API Adzuna:", data);
          setError("Formato de resposta inesperado da API Adzuna.");
        }
      } catch (e) {
        console.error("Erro ao buscar vagas da Adzuna:", e);
        setError(e.message || "Ocorreu um erro ao buscar as vagas.");
        setJobs([]); // Garante que a lista esteja vazia em caso de erro
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
    // Dependências: re-busca se o país ou a tag mudar
  }, [countryCode, categoryTag]);

  // Filtrar vagas baseado no estado 'filtro'
  const vagasFiltradas = jobs.filter(
    (job) => job.title.toLowerCase().includes(filtro.toLowerCase())
    // Opcional: buscar na descrição (pode deixar mais lento ou trazer resultados inesperados)
    // || (job.description && job.description.toLowerCase().includes(filtro.toLowerCase()))
  );

  return (
    <div className={style.category}>
      <div className={style.categoryHeader}>
        {/* Mostra nome e país */}
        <h2>
          Vagas em: {categoryName} ({displayCountry})
        </h2>
        {/* Input de Filtro - só aparece se não estiver carregando e não houver erro inicial */}
        {!loading && !error && (
          <input
            type="text"
            placeholder="Filtrar por título (ex: Front-end, React, Senior...)"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className={style.filterInput}
          />
        )}
      </div>

      {loading && (
        <p>
          Carregando vagas para {categoryName} ({displayCountry})...
        </p>
      )}
      {error && <p className={style.errorText}>{error}</p>}

      {!loading && !error && jobs.length > 0 && (
        <>
          {jobs.length === 0 ? (
            <p className={style.statusMessage}>
              Nenhuma vaga encontrada para "{categoryName}" em {displayCountry}{" "}
              no momento.
            </p>
          ) : vagasFiltradas.length === 0 ? (
            <p className={style.statusMessage}>
              Nenhuma vaga encontrada com o filtro "{filtro}".
            </p>
          ) : (
            <ul className={style.categoryList}>
              {vagasFiltradas.map((job) => (
                // Usar job.id da Adzuna como chave
                <li className={style.categoryItem} key={job.id}>
                  <div>
                    <a
                      className={style.categoryLink}
                      // Usar redirect_url da Adzuna para o link externo
                      href={job.redirect_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={job.description} // Adiciona descrição no title para acessibilidade/hover
                    >
                      {/* Usar job.title da Adzuna */}
                      {job.title}
                    </a>
                  </div>
                  {/* Usar job.company.display_name e job.location.display_name */}
                  <span className={style.companyName}>
                    {job.company?.display_name} - {job.location?.display_name}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
