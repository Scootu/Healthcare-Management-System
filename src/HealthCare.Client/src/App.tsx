import { routes, renderRoutes } from "./Routes/routes";
import ModeProvider from "./contexts/Mode/modeProvider";
import { Routes } from "react-router-dom"
function App() {
// password of supabase poject: supaBaseWalid1145
/**
 * Amine 
 * values ('amine@example.com', crypt('Amine1SupaBase', gen_salt('bf'))),
 * Anes 
 * values ('anes@example.com', crypt('2AnesSupaBase', gen_salt('bf')));
 */
  return (
   <>
   <ModeProvider>
   <InitApp/>
   </ModeProvider>
   </>
  );
}

  

function InitApp(){
  return(
    <>
     <Routes>
      {renderRoutes(routes)}
     </Routes>
    </>
  )
}
    

export default App;
