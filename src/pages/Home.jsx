import React from "react";
import { useState } from "react";
import basys_logo from "../assests/basys_logo.webp";
import { Configuration, OpenAIApi } from "openai";
import "../styles/Home.css";

function Home() {
  const [text, setText] = useState("");
  const [text2, setText2] = useState("");
  const [response, setResponse] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null); // State for selected value

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectOption = (option) => {
    setSelectedValue(option);
    setIsOpen(false);
  };

  const openai = new OpenAIApi(
    new Configuration({
      apiKey: process.env.REACT_APP_API_KEY,
    })
  );

  const handleSubmit = (e) => {
    openai
      .createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Policy 1: "+ text+"\n Policy 2: "+ text2+"\n",
          },
          {
            role: "user",
            content:
              `Given the detail about the 2 ${selectedValue} policy, come up with multiple criteria of evaluation based on it(atleast 15) and rate them out of 10. Later also generate a final score, which is average of all for each policy. Also compare both of them based on those criteria and tell which one is better. Mention some suggestions what and where to change so as to increase the rating. Also can you please suggest some alternate pathways for the same.  Generate response in a structured order which is easily readable.`,
          },
        ],
      })
      .then((res) => {
        const generatedText = res.data.choices[0].message.content;
        setResponse(generatedText);
      })
      .catch((err) => {
        console.error("Error:", err);
      })
      .finally(() => {
        // setText("");
      });
  };

  return (
    <div>
      <img src={basys_logo} alt="logo" />
      {
        !response && 
        <>
        
        <h1>Enter the description</h1>
        <div className="dropdown">
      <button className="dropdown-toggle" onClick={toggleDropdown}>
        {selectedValue ? selectedValue : 'Select an option'}
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          <ul>
            <p onClick={() => handleSelectOption('Medical')}>Medical</p>
            <p onClick={() => handleSelectOption('Pharmacy')}>Pharmacy</p>
          </ul>
        </div>
      )}
    </div>
<br />
        <textarea
          name="input"
          id="input"
          cols="150"
          rows="10"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
        ></textarea>
        <br />
        <textarea
          name="input2"
          id="input2"
          cols="150"
          rows="10"
          value={text2}
          onChange={(e) => {
            setText2(e.target.value);
          }}
        ></textarea>
        <br />
        <button
          onClick={() => {
            //   console.log(text);
            handleSubmit();
          }}
        >
          Submit
        </button>
        <br />
        </>
      }
      <p>{response}</p>
    </div>
  );
}

export default Home;
