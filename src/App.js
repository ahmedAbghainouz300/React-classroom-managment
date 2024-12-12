import "./App.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import CoordinateurLayout from "./Layouts/CoordinateurLayout";
import Home from "./Coordinateur_pages/Home";
import Filiere from "./Coordinateur_pages/Filiere";
import Matiere from "./Coordinateur_pages/Matiere";
import Reservation from "./Responsable_pages/Reservation";
import Login from "./Login_page/Login";
import ProfileC from "./Coordinateur_pages/profile_c";
import ProfesseurLayout from "./Layouts/ProfesseurLayout";
import HomeP from "./Professeur_pages/HomeP";
import ProfileP from "./Professeur_pages/ProfileP";
import EmploiP from "./Professeur_pages/EmploiP";
import HomeR from "./Responsable_pages/HomeR";
import EmploiR from "./Responsable_pages/EmploiR";
import ProfileR from "./Responsable_pages/ProfileR";
import ResponsableLayout from "./Layouts/ResponsableLayout";
import Salle from "./Responsable_pages/Salle";
import LiberationP from "./Professeur_pages/LiberationP";
import SalleP from "./Professeur_pages/SalleP";
import Seance from "./Coordinateur_pages/Seance";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Login />} />
      <Route element={<CoordinateurLayout />}>
        <Route path="/CoordinateurLayout" element={<Home />} />
        <Route path="/Coordinateur/" element={<Home />} />
        <Route path="/Coordinateur/Home" element={<Home />} />
        <Route path="/Coordinateur/Filiere" element={<Filiere />} />
        <Route path="/Coordinateur/Matiere" element={<Matiere />} />
        <Route path="/Coordinateur/Seance" element={<Seance />} />
        <Route path="/Coordinateur/Profile_c" element={<ProfileC />} />
      </Route>
      <Route element={<ProfesseurLayout />}>
        <Route path="/ProfesseurLayout" element={<HomeP />} />
        <Route path="/Professeur/" element={<HomeP />} />
        <Route path="/Professeur/Home" element={<HomeP />} />
        <Route path="/Professeur/Emploi" element={<EmploiP />} />
        <Route path="/Professeur/Liberation" element={<LiberationP />} />
        <Route path="/Professeur/Salle" element={<SalleP />} />
        <Route path="/Professeur/ProfileP" element={<ProfileP />} />
      </Route>
      <Route element={<ResponsableLayout />}>
        <Route path="/ResponsableLayout" element={<HomeR />} />
        <Route path="/Responsable/" element={<HomeR />} />
        <Route path="/Responsable/Home" element={<HomeR />} />
        <Route path="/Responsable/Emploi" element={<EmploiR />} />
        <Route path="/Responsable/Reservation" element={<Reservation />} />
        <Route path="/Responsable/ProfileR" element={<ProfileR />} />
        <Route path="/Responsable/Salle" element={<Salle />} />
      </Route>
    </>
  )
);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
