import { createContext } from "react";
import { type ModeInterface } from "./modeInterface";
const ModeContext = createContext<ModeInterface>({
    mode: "light",
    toggleMode: () => {},
});

export default ModeContext;
