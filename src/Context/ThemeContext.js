import { react,useState,createContext,useContext} from 'react';

const DarkModeContext = createContext();

//provider
export const ThemeProvider = ({children})=>{
    const [isDarkMode, setIsDarkMode] = useState(()=>{
        return localStorage.getItem('dark')==='true';
    }); 

    const toggleDarkMode = () =>{
        setIsDarkMode(prevMode=>!prevMode);
    }

    return(
        <DarkModeContext.Provider value={{isDarkMode,toggleDarkMode}} >
            {children}
        </DarkModeContext.Provider>
    )
}

//custom hook
export const useDarkMode = ()=>{
    return useContext(DarkModeContext);
}