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
import Emploi from "./Coordinateur_pages/Emploi";
import Reservation from "./Coordinateur_pages/Reservation";
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

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Login />} />
      <Route element={<CoordinateurLayout />}>
        <Route path="/CoordinateurLayout" element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Filiere" element={<Filiere />} />
        <Route path="/Matiere" element={<Matiere />} />
        <Route path="/Emploi" element={<Emploi />} />
        <Route path="/Reservation" element={<Reservation />} />
        <Route path="/Profile_c" element={<ProfileC />} />
      </Route>
      <Route element={<ProfesseurLayout />}>
        <Route path="/ProfesseurLayout" element={<HomeP />} />
        <Route path="/" element={<HomeP />} />
        <Route path="/Home" element={<HomeP />} />
        <Route path="/Emploi" element={<EmploiP />} />
        <Route path="/Reservation" element={<Reservation />} />
        <Route path="/ProfileP" element={<ProfileP />} />
      </Route>
      <Route element={<ResponsableLayout />}>
        <Route path="/ResponsableLayout" element={<HomeR />} />
        <Route path="/" element={<HomeR />} />
        <Route path="/Home" element={<HomeR />} />
        <Route path="/Emploi" element={<EmploiR />} />
        <Route path="/Reservation" element={<Reservation />} />
        <Route path="/ProfileR" element={<ProfileR />} />
        <Route path="/Salle" element={<Salle />} />
      </Route>
    </>
  )
);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
