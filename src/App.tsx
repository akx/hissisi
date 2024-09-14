import useSWR from "swr";
import bdf from "./Bm437_Nix8810_M15-16.bdf?raw";
import { loadFontFromString } from "./draw.ts";
import { MorphView } from "./components/MorphView.tsx";

function App() {
  const fontSWR = useSWR("font", () => loadFontFromString(bdf));
  const font = fontSWR.data;
  return font ? <MorphView font={font} /> : null;
}

export default App;
