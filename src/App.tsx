import Sidebar from "./components/Sidebar.tsx";
import Header from "./components/Header";
import PledgeClass from "./components/PledgeClass";

function App() {
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
    )
}

export default App