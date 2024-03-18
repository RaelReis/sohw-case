import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowsCounterClockwise, Check } from "@phosphor-icons/react";

export type JsonData = Data[];

export interface Data {
  id: string;
  sku: string;
  name: string;
  description: string;
  link: string;
  prompt: string;
  outputCode: string;
  validated?: boolean;
  remake?: boolean;
}

function App() {
  const [jsonData, setJsonData] = useState<JsonData>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await axios.get("http://localhost:3000/data");
        const response = await axios.get<{ data: JsonData }>("../data.json");
        // setJsonData(response.data);
        setJsonData(
          response.data.data
            .filter((data) => data.validated)
            .filter(
              (data) =>
                data.outputCode
                  .replace("<strong>", "")
                  .replace("<p>", "")
                  .replace("</strong>", "")
                  .replace("</p>", "")
                  .split(" ")
                  .map((word) => word.replace(/[\s\S]*?(#\w+)/g, "$1"))
                  .filter((word) => word.startsWith("#")).length !== 0
            )
        );
      } catch (error) {
        console.error("Erro ao carregar o arquivo JSON:", error);
      }
    };

    fetchData();
  }, []);

  async function handleValidation(toChangeData: Data) {
    const response = await axios.put(
      `http://localhost:3000/data/${toChangeData.id}`,
      { ...toChangeData, validated: true }
    );

    setJsonData((prevState) =>
      prevState.map((data) => {
        if (data.id === toChangeData.id) {
          return response.data;
        }
        return data;
      })
    );
    console.log(response.data);
  }

  async function handleRemake(toRemakeData: Data) {
    const response = await axios.put(
      `http://localhost:3000/data/${toRemakeData.id}`,
      { ...toRemakeData, remake: true }
    );

    setJsonData((prevState) =>
      prevState.map((data) => {
        if (data.id === toRemakeData.id) {
          return response.data;
        }
        return data;
      })
    );
    console.log(response.data);
  }

  return (
    <>
      <div>
        {/* <span className="float">
          {jsonData && jsonData.filter((data) => data.validated).length}
        </span>
        <span className="float">
          {jsonData && jsonData.filter((data) => data.remake).length}
        </span> */}
        {jsonData &&
          jsonData
            .filter((data) => data.outputCode)
            .map((data) => {
              return (
                <div
                  className={`mx-6 container ${
                    data.validated && "validated."
                  } ${data.remake && "remake."}`}
                >
                  <div className="header-wrapper">
                    <span>{data.sku}</span>
                    <span>
                      {jsonData.filter((data) => data.outputCode).length}{" "}
                      Produtos
                    </span>
                    <div className="action-warpper">
                      <button onClick={() => handleRemake(data)}>
                        <ArrowsCounterClockwise size={24} />
                      </button>
                      <button onClick={() => handleValidation(data)}>
                        <Check size={24} />
                      </button>
                    </div>
                  </div>
                  <div className="product-info-wrapper">
                    <span>{data.name}</span>
                    <p>{data.description}</p>
                  </div>
                  <ul className="tags-wrapper">
                    {data.outputCode &&
                      data.outputCode
                        .replace("<strong>", "")
                        .replace("<p>", "")
                        .replace("</strong>", "")
                        .replace("</p>", "")
                        .split(" ")
                        .map((word) => word.replace(/[\s\S]*?(#\w+)/g, "$1"))
                        .filter((word) => word.startsWith("#"))
                        .map((char) => (
                          <li className="tag">
                            {char.replace("</strong>", "").replace("</p>", "")}
                          </li>
                        ))}
                  </ul>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: data.outputCode as string,
                    }}
                  ></div>
                </div>
              );
            })}
      </div>
    </>
  );
}

export default App;
