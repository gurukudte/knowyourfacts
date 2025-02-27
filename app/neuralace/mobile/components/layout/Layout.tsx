import StartScreen from "../StartScreen";
import MainRecording from "../MainScreen";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import { useEffect } from "react";
import { retrieveFromDatabase } from "../../slices/sessionSlice";
import EndScreen from "../EndScreen";

const SessionLayout = () => {
  const { isSessionInProgress, ...other } = useAppSelector(
    (state) => state.session
  );
  const session = other.currentSession;
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isSessionInProgress) {
      dispatch(retrieveFromDatabase({ isSessionInProgress, ...other }));
    }
  }, [isSessionInProgress]);
  return (
    <>
      <div className="relative h-screen flex flex-col">
        <Header />
        <main className="w-full px-4">
          <div className="my-28">
            {!isSessionInProgress ? (
              <StartScreen />
            ) : session >= 14 ? (
              <EndScreen />
            ) : (
              <MainRecording />
            )}
          </div>
        </main>
        {session < 14 && <Footer />}
      </div>
    </>
  );
};

export default SessionLayout;
