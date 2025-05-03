import app_style from "./App.module.css";
import DeviceCheck from "./DeviceCheck";
import Routerrs from "./router";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <div className={app_style.main}>
        <Routerrs />
      </div>
    </>
  );
}

export default App;
