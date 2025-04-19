import React, { useState, useEffect } from "react";
import styles from "./featuredJobs.module.css";

// Ler credenciais das variáveis de ambiente
const ADZUNA_APP_ID = import.meta.env.VITE_ADZUNA_APP_ID;
const ADZUNA_APP_KEY = import.meta.env.VITE_ADZUNA_APP_KEY;

// Verificar se as variáveis de ambiente foram carregadas
if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) {
  console.error(
    "Erro: Variáveis de ambiente VITE_ADZUNA_APP_ID ou VITE_ADZUNA_APP_KEY não definidas."
  );
}

function FeaturedJobs() {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) {
      setError("Configuração de API ausente.");
      setLoading(false);
      return;
    }

    const fetchFeaturedJobs = async () => {
      setLoading(true);
      setError(null);
      setFeaturedJobs([]);

      // API para buscar 4 vagas de TI mais recentes no Brasil
      const apiUrl = `https://api.adzuna.com/v1/api/jobs/br/search/1?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}&results_per_page=4&category=it-jobs&sort_by=date&content-type=application/json`;

      try {
        console.log(`Buscando vagas em destaque: ${apiUrl}`);
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(
            `Erro HTTP ao buscar vagas em destaque! status: ${response.status}`
          );
        }

        const data = await response.json();

        if (data && Array.isArray(data.results) && data.results.length > 0) {
          setFeaturedJobs(data.results);
        } else {
          // Não definir erro, apenas logar que não vieram vagas em destaque
          console.warn(
            "Nenhuma vaga em destaque encontrada ou formato inesperado.",
            data
          );
          setFeaturedJobs([]); // Garante lista vazia
        }
      } catch (e) {
        console.error("Erro ao buscar vagas em destaque:", e);
        setError(e.message || "Ocorreu um erro ao buscar vagas em destaque.");
        setFeaturedJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedJobs();
  }, []); // Executa apenas uma vez

  // Não renderiza a seção se estiver carregando, com erro, ou sem vagas
  if (loading || error || featuredJobs.length === 0) {
    // Poderíamos retornar um loader ou mensagem de erro aqui se quiséssemos
    // console.log({loading, error, featuredJobs}); // Para debug
    return null;
  }

  return (
    <section className={styles.featuredSection}>
      <h2 className={styles.title}>Vagas em Destaque</h2>
      <div className={styles.jobsGrid}>
        {featuredJobs.map((job) => (
          // Card similar ao do componente Category
          <div className={styles.jobCard} key={job.id}>
            <div>
              <a
                className={styles.jobLink}
                href={job.redirect_url}
                target="_blank"
                rel="noopener noreferrer"
                title={job.description}
              >
                {job.title}
              </a>
            </div>
            <span className={styles.companyLocation}>
              {job.company?.display_name} - {job.location?.display_name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedJobs;
