import { useCallback, useState } from "react";

import { useNowPlaying } from "react-nowplaying";
const Controls = ({ callback }) => {
  const mlQuestions = [
    "What is the difference between supervised and unsupervised learning?",
    "Can you explain the concept of overfitting and how to prevent it?",
    "What is a confusion matrix and how is it used?",
    "How do you handle missing or corrupted data in a dataset?",
    "What is the bias-variance tradeoff?",
    "Can you explain the concept of cross-validation?",
    "What are some common metrics for evaluating the performance of a classification model?",
    "What is the difference between a generative and a discriminative model?",
    "How does a decision tree algorithm work?",
    "What is the purpose of regularization in machine learning models?",
    "Can you explain the concept of gradient descent?",
    "What are some common techniques for feature selection?",
    "How do you handle imbalanced datasets?",
    "What is the difference between bagging and boosting?",
    "Can you explain the concept of a neural network?",
    "What is the purpose of an activation function in a neural network?",
    "How do convolutional neural networks (CNNs) work?",
    "What is a recurrent neural network (RNN) and where is it used?",
    "Can you explain the concept of transfer learning?",
    "What are some common applications of reinforcement learning?",
  ];
  const [text, setText] = useState(
    mlQuestions[Math.floor(Math.random() * mlQuestions.length)]
  );
  const { stop: stopAudio, play: playAudio } = useNowPlaying();
  // console.log(mlQuestions);

  const sendText = useCallback(
    async (event) => {
      callback(new (window.AudioContext || window.webkitAudioContext)());

      stopAudio();

      const model = "aura-asteria-en";

      const response = await fetch(`/api/speak?model=${model}`, {
        cache: "no-store",
        method: "POST",
        body: JSON.stringify({ text }),
      });

      stopAudio();
      setText(mlQuestions[Math.floor(Math.random() * mlQuestions.length)]);

      playAudio(await response.blob(), "audio/mp3");
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [text]
  );
  const handleCLick = (event) => {
    event.preventDefault();
    sendText(text);
  };

  return (
    <>
      {/* Interview Question Section */}
      <div className="p-6 mt-10 bg-gray-800 text-yellow-50 rounded-md shadow-lg">
        <p className="text-xl font-semibold">Your Interview Question:</p>
        <p className="mt-2 text-base">{text}</p>
      </div>

      {/* Ask Question Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleCLick}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-md shadow-md transition duration-200 ease-in-out"
        >
          Ask Question
        </button>
      </div>
    </>
  );
};

export default Controls;
