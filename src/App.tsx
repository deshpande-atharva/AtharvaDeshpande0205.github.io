import { lazy, Suspense } from "react";
import "./App.css";

const MainContainer = lazy(() => import("./components/MainContainer"));
import { LoadingProvider } from "./context/LoadingProvider";
import Lanyard from "./components/Lanyard";

const App = () => {
  return (
    <>
      <LoadingProvider>
        <Suspense>
          <MainContainer>
            <Lanyard
              frontImage={`${import.meta.env.BASE_URL}images/card-front1.png`}
              backImage={`${import.meta.env.BASE_URL}images/card-back.png`}
              imageFit="cover"
              cardColor="#a0a0a0"
              orientation="portrait"
              finish="glossy"
              cornerRadius={0.3}
              size={0.55}
              anchor="center"
              strapLength={0.5}
              strapColor="#111111"
              strapWidth={0.65}
              metal="silver"
              gravity={1}
              damping={0.5}
              elasticity={0.5}
              breeze={0.5}
              interactive
              intro
            />
          </MainContainer>
        </Suspense>
      </LoadingProvider>
    </>
  );
};

export default App;
