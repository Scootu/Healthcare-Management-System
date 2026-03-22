import modeContext from "./modeContext";
import type { ModeInterface } from "./modeInterface";
import { useContext } from "react";
const useMode = (): ModeInterface => {
    if(!modeContext){
        throw new Error("useMode must be used within a ModeProvider");
    }
    return useContext(modeContext);
};
export default useMode;