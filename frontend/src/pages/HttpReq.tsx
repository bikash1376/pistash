import { useState } from "react";

const HttpReq = () => {
    const [method, setMethod] = useState("");
    const [url, setUrl] = useState("");
    const [body, setBody] = useState(`{
  "name": "Apple MacBook Pro 16",
  "data": {
    "year": 2019,
    "price": 1849.99,
    "CPU model": "Intel Core i9",
    "Hard disk size": "1 TB"
  }
}`);


    // const urlValue = url;

async function handleGET() {
        const urlValue = url;
        try {
            const response = await fetch(`${urlValue}`);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            console.log(method);
            const json = await response.json();
            console.log(json);
        } catch (error) {
            console.error(error.message);
        }
    }


async function handlePOST(body: string) {
    const urlValue = url;
    try {
        const parsedBody = JSON.parse(body); // ← fix here

        const response = await fetch(urlValue, {
            method: "POST",
            headers: {
                
                "Content-Type": "application/json",
            },
            body: JSON.stringify(parsedBody),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Response:", data);
        return data;
    } catch (error: any) {
        console.error("API Error:", error.message);
        return null;
    }
};


async function handlePUT(body: string) {
    const urlValue = url;
    try {
        const parsedBody = JSON.parse(body);

        const response = await fetch(urlValue, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(parsedBody),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("PUT Response:", data);
        return data;
    } catch (error: any) {
        console.error("PUT Error:", error.message);
        alert("PUT failed. Check console for details.");
        return null;
    }
}


async function handleDELETE() {
    const urlValue = url;
    try {
        const response = await fetch(urlValue, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
            console.log("DELETE Response:", data);
            return data;
        } 
        catch (error: any) {
            console.error("DELETE Error:", error.message);
            alert("DELETE failed. Check console for details.");
            return null;
    }
}



    const handleRequest = (method:any) => {
        switch (method) {
            case "GET":
                console.log(method);
                handleGET();
                break;
            case "POST":
                handlePOST(body);
                break;
            case "PUT":
                handlePUT(body);
                break;
            case "DELETE":
                handleDELETE();
                break;
            // case "SCRAPE":
            //     handleSend();
            //     break;
        }
    };

    return (
        <div className="flex justify-center items-center h-[100vh]">
            <select
                name=""
                id=""
                value={method}
                onChange={(e) => setMethod(e.target.value)}
            >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="SCRAPE">SCRAPE</option>
            </select>
            <input
                type="text"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
            />
            <button onClick={() => {handleRequest(method)}}>SEND</button>


            <textarea
                placeholder='Enter JSON body here'
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={6}
                style={{ width: "100%" }}
            />

        </div>
    );
};

export default HttpReq;
