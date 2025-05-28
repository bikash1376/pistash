// import Notes from "./components/Notes";

import HttpReq from "./pages/HttpReq";

// import Button from "./components/ui/Button";
// import Card from "./components/ui/Card";
// import Tabs from "./components/ui/Tabs";

// const tabData = [
//   { id: "home", label: "Home", content: "Welcome!", color: "#f3f4f6", textColor: "text-black", width: "150px" },
//   { id: "profile", label: "Profile", content: "Your Profile Info", color: "#f3f4f6", textColor: "text-gray-800", width: "160px" },
//   { id: "settings", label: "Settings", content: "Customize your preferences.", color: "f3f4f6", textColor: "text-gray-900", width: "170px" },
// ];

function App() {
  return (
    <>
      {/* <Notes/>
       */}

      {/* <div className="flex gap-4 p-6"> */}
      {/* <Button text="Primary" color="primary" size="medium" /> */}
      {/* <Button text="Primary" color="secondary" size="large" />
      <Button text="Primary" color="success" size="small" /> */}

      {/* <Card text="Not Bikash" color="bg-gray-900" textColor="text-white" textSize="large" /> */}
      {/* </div> */}
      {/* <Tabs tabs={tabData} />; */}

      <HttpReq />
    </>
  );
}

export default App;
