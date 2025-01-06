import StartScreen from "../StartScreen";
import MainRecording from "../Main";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { useAppSelector } from "../../store/hooks";

const SessionLayout = () => {
  const { isSessionInProgress } = useAppSelector((state) => state.session);
  return (
    <div className="relative h-screen flex flex-col">
      <Header />
      <main className="w-full px-4">
        <div className="my-28">
          {!isSessionInProgress ? <StartScreen /> : <MainRecording />}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SessionLayout;
