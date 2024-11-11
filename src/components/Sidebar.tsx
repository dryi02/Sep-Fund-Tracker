function Sidebar(){
    return (
        <div className="flex flex-col gap-6">
            <h3 className="text-2xl font-semibold">Pledge Class</h3>
            <button className="bg-amber-300 rounded-lg text-xl p-4 w-48">Add a New Class</button>
            <div>
                <h2 className="text-2xl">[Pledge Class Name]</h2>
            </div>
        </div>
    )
}

export default Sidebar;