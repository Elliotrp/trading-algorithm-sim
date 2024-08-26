import "./App.css";
import { DarkModeProvider } from "./components/dark-mode-provider.component";
import HeroSection from "./components/hero-section.component";
import Simulation from "./components/simulation.component";

function App() {
   return (
      <>
         <HeroSection></HeroSection>
         <div className="max-h-screen bg-gray-100 px-2.5 pt-14 pb-24 dark:bg-black text-black dark:text-white">
            <DarkModeProvider>
               <Simulation></Simulation>
            </DarkModeProvider>
         </div>
      </>
   );
}

export default App;
