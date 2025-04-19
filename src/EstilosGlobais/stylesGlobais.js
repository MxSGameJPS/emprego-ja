import { createGlobalStyle } from "styled-components";

const EstilosGlobais = createGlobalStyle`
html {
  line-height: 1.15; /* 1 */
  -webkit-text-size-adjust: 100%; /* 2 */
  height: 100%; 
}

body {
  margin: 0;
  padding: 0;
  background-color: #0F0B0BFF;
  color: #fff;
  font-family: 'Poppins', sans-serif;
  box-sizing: border-box;
  min-height: 100%; /* Garante que body tenha pelo menos a altura do html */
}

#root { /* Assumindo que seu app monta em <div id="root"> */
  min-height: 100vh; /* Garante que a raiz do app ocupe a altura da tela */
  display: flex; /* Necessário para que o filho flex (próximo seletor) funcione corretamente */
  flex-direction: column;
}

#root > div { /* O div wrapper direto dentro do #root (nosso container em App.jsx) */
  display: flex;
  flex-direction: column;
  flex-grow: 1; /* Faz este div crescer para preencher o #root */
  /* min-height: 100vh; não é mais necessário aqui, pois #root já cuida disso */
}

#root > div > main { /* O elemento main dentro do nosso div wrapper */
  flex-grow: 1; /* Faz o conteúdo principal crescer e empurrar o footer */
}

main {
  display: block;
}

h1 {
  font-size: 2em;
  margin: 0.67em 0;
}

hr {
  box-sizing: content-box; /* 1 */
  height: 0; /* 1 */
  overflow: visible; /* 2 */
}

pre {
  font-family: monospace, monospace; /* 1 */
  font-size: 1em; /* 2 */
}

a {
  background-color: transparent;
}

abbr[title] {
  border-bottom: none; /* 1 */
  text-decoration: underline; /* 2 */
  text-decoration: underline dotted; /* 2 */
}

b,
strong {
  font-weight: bolder;
}

code,
kbd,
samp {
  font-family: monospace, monospace; /* 1 */
  font-size: 1em; /* 2 */
}

small {
  font-size: 80%;
}



sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

sub {
  bottom: -0.25em;
}

sup {
  top: -0.5em;
}


img {
  border-style: none;
}



button,
input,
optgroup,
select,
textarea {
  font-family: inherit; /* 1 */
  font-size: 100%; /* 1 */
  line-height: 1.15; /* 1 */
  margin: 0; /* 2 */
}


button,
input { /* 1 */
  overflow: visible;
}



button,
select { /* 1 */
  text-transform: none;
}


button,
[type="button"],
[type="reset"],
[type="submit"] {
  -webkit-appearance: button;
}



button::-moz-focus-inner,
[type="button"]::-moz-focus-inner,
[type="reset"]::-moz-focus-inner,
[type="submit"]::-moz-focus-inner {
  border-style: none;
  padding: 0;
}


button:-moz-focusring,
[type="button"]:-moz-focusring,
[type="reset"]:-moz-focusring,
[type="submit"]:-moz-focusring {
  outline: 1px dotted ButtonText;
}



fieldset {
  padding: 0.35em 0.75em 0.625em;
}



legend {
  box-sizing: border-box; /* 1 */
  color: inherit; /* 2 */
  display: table; /* 1 */
  max-width: 100%; /* 1 */
  padding: 0; /* 3 */
  white-space: normal; /* 1 */
}



progress {
  vertical-align: baseline;
}



textarea {
  overflow: auto;
}


[type="checkbox"],
[type="radio"] {
  box-sizing: border-box; /* 1 */
  padding: 0; /* 2 */
}



[type="number"]::-webkit-inner-spin-button,
[type="number"]::-webkit-outer-spin-button {
  height: auto;
}



[type="search"] {
  -webkit-appearance: textfield; /* 1 */
  outline-offset: -2px; /* 2 */
}



[type="search"]::-webkit-search-decoration {
  -webkit-appearance: none;
}



::-webkit-file-upload-button {
  -webkit-appearance: button; /* 1 */
  font: inherit; /* 2 */
}

/* Interactive
   ========================================================================== */

/*
 * Add the correct display in Edge, IE 10+, and Firefox.
 */

details {
  display: block;
}

/*
 * Add the correct display in all browsers.
 */

summary {
  display: list-item;
}



template {
  display: none;
}



[hidden] {
  display: none;
}
`;

export default EstilosGlobais;
