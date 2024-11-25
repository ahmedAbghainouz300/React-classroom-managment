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

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Login />} />
      <Route element={<CoordinateurLayout />}>
        <Route path="/CoordinateurLayout" element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Filiere" element={<Filiere />} />
        <Route path="/Matiere" element={<Matiere />} />
        <Route path="/Emploi" element={<Emploi />} />
        <Route path="/Reservation" element={<Reservation />} />
      </Route>
    </>
  )
);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
