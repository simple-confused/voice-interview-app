"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  LiveConnectionState,
  LiveTranscriptionEvents,
  useDeepgram,
} from "../context/DeepgramContextProvider";
import { useMicrophone } from "../context/MicrophoneContextProvider";
import { useNowPlaying } from "react-nowplaying";
import dynamic from "next/dynamic";

const Controls = dynamic(() => import("./Controls"), { ssr: false });

const App = () => {
  const [response, setResponse] = useState();
  const [caption, setCaption] = useState("");
  const [context, setContext] = useState();
  const { player } = useNowPlaying();

  const { connection, connectToDeepgram, connectionState } = useDeepgram();
  const { setupMicrophone, microphone, startMicrophone, microphoneState } =
    useMicrophone();
  const captionTimeout = useRef();
  const keepAliveInterval = useRef();

  useEffect(() => {
    setupMicrophone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (microphoneState === 1) {
      connectToDeepgram({
        model: "nova-2",
        interim_results: true,
        smart_format: true,
        filler_words: true,
        utterance_end_ms: 3000,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [microphoneState]);

  useEffect(() => {
    if (!microphone) return;
    if (!connection) return;

    const onData = (e) => {
      // iOS SAFARI FIX:
      // Prevent packetZero from being sent. If sent at size 0, the connection will close.
      if (e.data.size > 0) {
        connection?.send(e.data);
      }
    };

    const onTranscript = (data) => {
      const { is_final: isFinal, speech_final: speechFinal } = data;
      let thisCaption = data.channel.alternatives[0].transcript;

      console.log("thisCaption", thisCaption);
      if (thisCaption !== "") {
        console.log('thisCaption !== ""', thisCaption);
        setCaption(thisCaption);
      }

      if (isFinal && speechFinal) {
        clearTimeout(captionTimeout.current);
        captionTimeout.current = setTimeout(() => {
          setCaption(undefined);
          clearTimeout(captionTimeout.current);
        }, 3000);
      }
    };

    if (connectionState === LiveConnectionState.OPEN) {
      connection.addListener(LiveTranscriptionEvents.Transcript, onTranscript);
      microphone.addEventListener("dataavailable", onData);

      startMicrophone();
    }

    return () => {
      // prettier-ignore
      connection.removeListener(LiveTranscriptionEvents.Transcript, onTranscript);
      microphone.removeEventListener("dataavailable", onData);
      clearTimeout(captionTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionState]);

  useEffect(() => {
    if (!connection) return;

    if (microphoneState !== 3 && connectionState === LiveConnectionState.OPEN) {
      connection.keepAlive();

      keepAliveInterval.current = setInterval(() => {
        connection.keepAlive();
      }, 10000);
    } else {
      clearInterval(keepAliveInterval.current);
    }

    return () => {
      clearInterval(keepAliveInterval.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [microphoneState, connectionState]);
  // if (record) {
  //
  // }

  const handelRating = async () => {
    const res = await axios.post(
      "/api/llm",
      JSON.stringify({
        prompt: `Give Rating Out Of 10 for this Machine Learning Answer or else provide 0 : ${caption}`,
      })
    );
    setResponse(res.data);
  };

  return (
    <>
      <Controls
        callback={(ctx) => {
          setContext(ctx);
        }}
      />

      {/* Answer Section */}
      <div className="p-6 mt-10 bg-gray-800 rounded-md shadow-lg text-yellow-50">
        <p className="text-xl font-semibold text-center mb-2">Your Answer</p>
        <p className="text-base">{caption}</p>
      </div>

      {/* Rating Button */}
      <div className="flex justify-center">
        <button
          onClick={handelRating}
          className="mt-6 px-4 py-2 bg-yellow-500 text-gray-800 font-semibold rounded-md hover:bg-yellow-600 transition-colors duration-200 ease-in-out"
        >
          Get Rating
        </button>
      </div>
      {/* Rating Response Section */}
      <div className="p-6 mt-8 bg-gray-800 rounded-md shadow-lg text-yellow-50">
        <p className="text-xl font-semibold text-center mb-2">
          Rating According To LLM Model
        </p>
        <p className="text-xl text-yellow-50">{response}</p>
      </div>
    </>
  );
};

export default App;
