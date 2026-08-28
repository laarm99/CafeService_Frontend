import { useEffect, useState } from "react";
import { getAll } from "../api/FooApi";
import displayError from "../../../Utils/display-errors";
import { Button } from "antd";


export default function Foo() {
    const [foos, setFoos] = useState([]);
    useEffect(() => {
        getAll()
            .then((res) => {
                setFoos(res.data);
            })
            .catch((err) => {
                displayError(err);
            })
    }, []);
    return (<>
    <div
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center", 
    height: "100vh",
  }}
>
  <h1>Foo</h1>

  <iframe
    src="/diagrams/Test.drawio.html"
    style={{
      flex: 1,
      width: "90%",
      border: "1px solid #d9d9d9",
      borderRadius: 8,
    }}
  />
</div>
    </>);
}