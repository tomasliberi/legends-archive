import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer.jsx";
import Navbar from "./components/Navbar.jsx";
import CharacterDetailPage from "./pages/CharacterDetailPage.jsx";
import CharacterFormPage from "./pages/CharacterFormPage.jsx";
import CampaignDetailPage from "./pages/CampaignDetailPage.jsx";
import CampaignFormPage from "./pages/CampaignFormPage.jsx";
import CampaignsPage from "./pages/CampaignsPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import PlayerDetailPage from "./pages/PlayerDetailPage.jsx";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col font-body text-on-surface">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cargar-personaje" element={<CharacterFormPage />} />
        <Route path="/campanas" element={<CampaignsPage />} />
        <Route path="/crear-campana" element={<CampaignFormPage />} />
        <Route path="/editar-campana/:campaignId" element={<CampaignFormPage mode="edit" />} />
        <Route path="/campanas/:campaignId" element={<CampaignDetailPage />} />
        <Route path="/editar-personaje/:characterId" element={<CharacterFormPage mode="edit" />} />
        <Route path="/players/:playerId" element={<PlayerDetailPage />} />
        <Route
          path="/players/:playerId/characters/:characterId"
          element={<CharacterDetailPage />}
        />
      </Routes>
      <Footer />
    </div>
  );
}
