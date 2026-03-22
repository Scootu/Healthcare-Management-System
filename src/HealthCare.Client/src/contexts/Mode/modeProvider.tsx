import { useState, useEffect, type ReactNode } from "react";
import ModeContext from "./modeContext";
import { type ModeInterface } from "./modeInterface";

interface ModeProviderProps {
    children: ReactNode;
}

const ModeProvider = ({ children }: ModeProviderProps) => {
    const [mode, setMode] = useState<"light" | "dark">("light");

    useEffect(() => {
        const savedMode = localStorage.getItem("mode") as "light" | "dark" | null;
        if (savedMode) {
            setMode(savedMode);
            document.documentElement.classList.toggle("dark", savedMode === "dark");
        }
        else
        {
            const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
            const initialMode = prefersDark ? "dark" : "light";
            setMode(initialMode);
            document.documentElement.classList.toggle("dark", initialMode === "dark");
            localStorage.setItem("mode", initialMode);
        }
    }, []);

    const toggleMode = () => {
        setMode((prevMode) => {
            const newMode = prevMode === "light" ? "dark" : "light";
            localStorage.setItem("mode", newMode);
            document.documentElement.classList.toggle("dark", newMode === "dark");
            return newMode;
        });
    };

    const contextValue: ModeInterface = {
        mode,
        toggleMode,
    };

    return <ModeContext.Provider value={contextValue}>
        {children}
        </ModeContext.Provider>;
};

export default ModeProvider;