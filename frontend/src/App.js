import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import ServicesPage from "@/pages/ServicesPage";
import CategoryPage from "@/pages/CategoryPage";
import PublishServicePage from "@/pages/PublishServicePage";
import NewsPage from "@/pages/NewsPage";
import NewsArticle from "@/pages/NewsArticle";
import AdminDashboard from "@/pages/AdminDashboard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/servicios" element={<ServicesPage />} />
          <Route path="/categoria/:category" element={<CategoryPage />} />
          <Route path="/publicar-servicio" element={<PublishServicePage />} />
          <Route path="/noticias" element={<NewsPage />} />
          <Route path="/noticias/:slug" element={<NewsArticle />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
