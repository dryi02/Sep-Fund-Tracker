import React from "react"
import Sidebar from "./Sidebar.tsx";
import PledgeClass from "./PledgeClass.tsx";
import Header from "./Header.tsx";

const PledgeDashboard: React.FC = () => {
    return (
        <div className="py-[4vh] px-[4vw] flex flex-col items-start gap-10 min-h-screen">
            <Header/>
            <div className="flex flex-row w-full gap-10">
                <div className="w-1/6">
                    <Sidebar/>
                </div>
                <div className="w-5/6">
                    <PledgeClass/>
                </div>
            </div>
        </div>
    );
  };
  
  export default PledgeDashboard;