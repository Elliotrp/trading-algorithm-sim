import {
   ReactNode,
   createContext,
   useContext,
   useEffect,
   useState,
} from "react";
import { HiMoon, HiSun } from "react-icons/hi2";

const DarkModeContext = createContext(true);

export const DarkModeProvider = ({ children }: DarkModeProviderProps) => {
   const [isDarkMode, setIsDarkMode] = useState(true);

   useEffect(() => {
      if (isDarkMode) {
         document.documentElement.classList.add("dark");
      } else {
         document.documentElement.classList.remove("dark");
      }
   }, [isDarkMode]);

   return (
      <>
         <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="absolute right-0 top-0 m-2.5 z-50 inline-flex items-center px-2 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
         >
            {isDarkMode ? (
               <>
                  <HiMoon className="w-5 h-5" />
               </>
            ) : (
               <>
                  <HiSun className="w-5 h-5" />
               </>
            )}
         </button>
         <DarkModeContext.Provider value={isDarkMode}>
            {children}
         </DarkModeContext.Provider>
      </>
   );
};

export const isDarkMode = (): boolean => {
   return useContext(DarkModeContext);
};

interface DarkModeProviderProps {
   children: ReactNode;
}
