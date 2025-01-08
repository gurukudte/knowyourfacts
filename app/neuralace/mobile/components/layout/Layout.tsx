import StartScreen from "../StartScreen";
import MainRecording from "../Main";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useEffect } from "react";
import { retrieveFromDatabase } from "../../store/slices/sessionSlice";

const SessionLayout = () => {
  const { isSessionInProgress, ...other } = useAppSelector(
    (state) => state.session
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isSessionInProgress) {
      dispatch(retrieveFromDatabase({ isSessionInProgress, ...other }));
    }
  }, []);
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
