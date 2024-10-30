"use client";

import { createContext, useCallback, useContext, useState } from "react";

const MicrophoneContext = createContext(undefined);

const MicrophoneContextProvider = ({ children }) => {
  const [microphoneState, setMicrophoneState] = useState(-1);
  const [microphone, setMicrophone] = useState(null);

  const setupMicrophone = async () => {
    setMicrophoneState(0);

    try {
      const userMedia = await navigator.mediaDevices.getUserMedia({
        audio: {
          noiseSuppression: true,
          echoCancellation: true,
        },
      });

      const microphone = new MediaRecorder(userMedia);

      setMicrophoneState(1);
      setMicrophone(microphone);
    } catch (err) {
      console.error(err);

      throw err;
    }
  };

  const stopMicrophone = useCallback(() => {
    setMicrophoneState(5);

    if (microphone?.state === "recording") {
      microphone.pause();
      setMicrophoneState(6);
    }
  }, [microphone]);

  const startMicrophone = useCallback(() => {
    setMicrophoneState(2);

    if (microphone?.state === "paused") {
      microphone.resume();
    } else {
      microphone?.start(250);
    }

    setMicrophoneState(2);
  }, [microphone]);

  return (
    <MicrophoneContext.Provider
      value={{
        microphone,
        startMicrophone,
        stopMicrophone,
        setupMicrophone,
        microphoneState,
      }}
    >
      {children}
    </MicrophoneContext.Provider>
  );
};

function useMicrophone() {
  const context = useContext(MicrophoneContext);

  if (context === undefined) {
    throw new Error(
      "useMicrophone must be used within a MicrophoneContextProvider"
    );
  }

  return context;
}

export { MicrophoneContextProvider, useMicrophone };
