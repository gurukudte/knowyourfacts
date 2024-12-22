import { useSessionContext } from "../../context/SessionContext";
import StartScreen from "../StartScreen";
import MainRecording from "../Main";
import { Footer } from "./Footer";
import { Header } from "./Header";

const SessionLayout = () => {
  const {
    data: {
      sessionsData: { isNewDay },
    },
  } = useSessionContext();
  return (
    <div className="relative h-screen flex flex-col">
      <Header />
      <main className="w-full px-4">
        <div className="my-28">
          {isNewDay ? <StartScreen /> : <MainRecording />}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SessionLayout;
