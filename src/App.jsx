import { BrowserRouter, Route, Routes } from "react-router-dom";
import EstilosGlobais from "./EstilosGlobais/stylesGlobais";
import Home from "./Components/pages/Home";
import Header from "./Components/header";
import Footer from "./Components/footer";
import Category from "./Components/category";
import SearchResults from "./Components/SearchResults";
import About from "./Components/pages/About";

function App() {
  return (
    <BrowserRouter>
      <div>
        <EstilosGlobais />
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/categoria/adzuna/:countryCode/:categoryTag"
              element={<Category />}
            />
            <Route path="/search-results" element={<SearchResults />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
