import "./App.css";
import { DarkModeProvider } from "./components/dark-mode-provider.component";
import Simulation from "./components/simulation.component";

function App() {
   return (
      <>
         <div className="max-h-screen bg-white dark:bg-black text-black dark:text-white">
            <DarkModeProvider>
               <Simulation></Simulation>
            </DarkModeProvider>
         </div>
      </>
   );
}

export default App;
