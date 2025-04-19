import { FaGithub, FaInstagram } from "react-icons/fa";
import styles from "./sobre.module.css";

export default function About() {
  return (
    <div className={styles.about}>
      <h1>Sobre</h1>
      <p>
        Emprego Já é uma plataforma feita para ajudar quem está começando na
        área tech a encontrar oportunidades reais, acessíveis e em português.
        Buscamos vagas de estágio, júnior e remoto, facilitando o seu primeiro
        passo no mercado.
      </p>
      <h1>Nossa missão</h1>
      <p>
        Acreditamos que todo desenvolvedor merece uma chance de mostrar seu
        potencial. Por isso, criamos o Emprego Já: uma plataforma simples e
        direta que conecta você às melhores vagas de tecnologia no Brasil e no
        exterior — com foco em oportunidades de nível júnior, remoto ou estágio.
        Aqui, você encontra seu primeiro sim.
      </p>

      <h4>Gostou do nosso projeto?</h4>
      <span>
        Ajude-nos a melhorar a plataforma.
        <ul>
          <li>Desevolvedor: Saulo Pavanello</li>
          <li>Email: mxsgamejps@gmail.com</li>
          <li>Telefone: (51) 99339-2983</li>
          <li>
            Instagram:{" "}
            <a
              href="https://www.instagram.com/mxsgamejps/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram size={20} style={{ color: "#fff" }} /> @mxsgamejps
            </a>
          </li>
          <li>
            GitHub:{" "}
            <a href="https://github.com/mxsgamejps" target="_blank" rel="noopener noreferrer">
              <FaGithub size={20} style={{ color: "#fff" }} /> @mxsgamejps
            </a>
          </li>
        </ul>
      </span>
    </div>
  );
}
