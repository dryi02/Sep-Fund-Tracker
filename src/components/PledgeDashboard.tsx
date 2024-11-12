import { useState, useEffect, useRef } from "react";
import { BarChart, PieChart } from "@mui/x-charts";
import { Search, Download, RefreshCw, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Pledge {
  name: string;
  goal: number;
  progress: number;
  dateCompleted: string;
}

type PledgeField = keyof Pledge;

interface MockData {
  totalToRaise: number;
  pledgeClass: Pledge[];
}

interface EditingState {
  index: number | null;
  field: PledgeField | null;
  value: string;
}

const mockData: MockData = {
  totalToRaise: 400,
  pledgeClass: [
    {
      name: "Aarushi Manikandan",
      goal: 50.0,
      progress: 0.0,
      dateCompleted: "",
    },
    { name: "Adithi Gudipati", goal: 50.0, progress: 0.0, dateCompleted: "" },
    {
      name: "Meaghan Gouws",
      goal: 50.0,
      progress: 80.0,
      dateCompleted: "11/08",
    },
    { name: "Sergio Rivas", goal: 50.0, progress: 0.0, dateCompleted: "" },
    { name: "Tristan Szilagyi", goal: 50.0, progress: 0.0, dateCompleted: "" },
  ],
};

const calculateTotalRaised = (pledgeClass: Pledge[]): number => {
  return pledgeClass.reduce((sum, pledge) => sum + pledge.progress, 0);
};

export default function PledgeClass() {
  const [pledgeData, setPledgeData] = useState<MockData>(mockData);
  const [chartWidth, setChartWidth] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [lastUpdated, setLastUpdated] = useState<string>(
    new Date().toLocaleString()
  );
  const [activeTab, setActiveTab] = useState<"home" | "leaderboard">("home");
  const [uploadAmount, setUploadAmount] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setChartWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const [editing, setEditing] = useState<EditingState>({
    index: null,
    field: null,
    value: "",
  });

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const handleChange = (index: number, field: PledgeField, value: string) => {
    const newPledgeData = { ...pledgeData };
    const numValue = parseFloat(value) || 0;

    switch (field) {
      case "name":
        newPledgeData.pledgeClass[index].name = value;
        break;
      case "goal":
        newPledgeData.pledgeClass[index].goal = numValue;
        break;
      case "progress":
        newPledgeData.pledgeClass[index].progress = numValue;
        if (
          numValue >= newPledgeData.pledgeClass[index].goal &&
          !newPledgeData.pledgeClass[index].dateCompleted
        ) {
          const today = new Date();
          newPledgeData.pledgeClass[index].dateCompleted = `${(
            today.getMonth() + 1
          )
            .toString()
            .padStart(2, "0")}/${today.getDate().toString().padStart(2, "0")}`;
        }
        break;
      case "dateCompleted":
        newPledgeData.pledgeClass[index].dateCompleted = value;
        break;
    }

    setPledgeData(newPledgeData);
    setEditing((prev) => ({ ...prev, value }));
  };

  const startEditing = (index: number, field: PledgeField, value: string) => {
    setEditing({
      index,
      field,
      value:
        field === "progress" || field === "goal" ? value.toString() : value,
    });
  };

  const stopEditing = () => {
    setEditing({ index: null, field: null, value: "" });
  };

  const totalRaised = calculateTotalRaised(pledgeData.pledgeClass);
  const remainingToRaise = pledgeData.totalToRaise - totalRaised;

  const pieChartData = [
    { id: 0, value: totalRaised, label: "Total Raised", color: "#001F54" },
    { id: 1, value: remainingToRaise, label: "Remaining", color: "#e4e4e7" },
  ];

  const renderCell = (pledge: Pledge, index: number, field: PledgeField) => {
    const isEditing = editing.index === index && editing.field === field;

    if (isEditing) {
      switch (field) {
        case "progress":
        case "goal":
          return (
            <input
              type="number"
              value={editing.value}
              onChange={(e) => handleChange(index, field, e.target.value)}
              onBlur={stopEditing}
              className="w-24 bg-transparent border-b border-[#001F54] focus:outline-none"
              step="0.01"
              min="0"
              max={field === "progress" ? pledge.goal : undefined}
              autoFocus
            />
          );
        case "dateCompleted":
          return (
            <input
              type="text"
              value={editing.value}
              onChange={(e) => handleChange(index, field, e.target.value)}
              onBlur={stopEditing}
              className="bg-transparent w-20 border-b border-[#001F54] focus:outline-none"
              placeholder="MM/DD"
              pattern="\d{2}/\d{2}"
              autoFocus
            />
          );
        case "name":
          return (
            <input
              type="text"
              value={editing.value}
              onChange={(e) => handleChange(index, field, e.target.value)}
              onBlur={stopEditing}
              className="bg-transparent w-full border-b border-[#001F54] focus:outline-none"
              autoFocus
            />
          );
      }
    }

    const displayValue =
      field === "progress" || field === "goal"
        ? formatter.format(pledge[field])
        : pledge[field];

    return (
      <div
        onClick={() => startEditing(index, field, pledge[field].toString())}
        className="cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors"
      >
        {displayValue}
      </div>
    );
  };

  const filteredPledges = pledgeData.pledgeClass.filter((pledge) =>
    pledge.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportData = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Name,Goal,Progress,Date Completed\n" +
      pledgeData.pledgeClass
        .map((p) => `${p.name},${p.goal},${p.progress},${p.dateCompleted}`)
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "pledge_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRefreshData = () => {
    // In a real application, this would fetch new data from an API
    setLastUpdated(new Date().toLocaleString());
  };

  const handleUploadFunds = () => {
    const amount = parseFloat(uploadAmount);
    if (!isNaN(amount) && amount > 0) {
      const newPledgeData = { ...pledgeData };
      // For this example, we'll add the funds to the first pledge's progress
      newPledgeData.pledgeClass[0].progress += amount;
      setPledgeData(newPledgeData);
      setUploadAmount("");
      alert(`Successfully uploaded ${formatter.format(amount)}`);
    } else {
      alert("Please enter a valid amount");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("pledgeToken");
    localStorage.removeItem("role");
    navigate("/");
  };

  const getLeaderboardData = () => {
    return [...pledgeData.pledgeClass]
      .sort((a, b) => b.progress - a.progress) // Sort by progress in descending order
      .slice(0, 5); // Limit to top 5 performers
  };

  return (
    <div className="p-6 bg-[#F5F5F5] min-h-screen">
      <h1 className="text-4xl font-bold text-[#001F54] mb-6">Eta Class</h1>

      {/* Navigation Tabs */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <button
            className={`mr-4 px-4 py-2 rounded ${
              activeTab === "home"
                ? "bg-[#001F54] text-white"
                : "bg-gray-200 text-[#001F54]"
            }`}
            onClick={() => setActiveTab("home")}
          >
            Home
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === "leaderboard"
                ? "bg-[#001F54] text-white"
                : "bg-gray-200 text-[#001F54]"
            }`}
            onClick={() => setActiveTab("leaderboard")}
          >
            Leaderboard
          </button>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>

      {activeTab === "home" && (
        <>
          {/* Dashboard Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-semibold text-[#001F54] mb-4">
              Total Raised:{" "}
              {formatter.format(calculateTotalRaised(pledgeData.pledgeClass))}
            </h2>
            <h2 className="text-2xl font-semibold text-[#001F54] mb-4">
              Goal: {formatter.format(pledgeData.totalToRaise)}
            </h2>
          </div>

          {/* Upload Funds */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-semibold text-[#001F54] mb-4">
              Upload Funds
            </h2>
            <div className="flex items-center">
              <input
                type="number"
                value={uploadAmount}
                onChange={(e) => setUploadAmount(e.target.value)}
                placeholder="Enter amount"
                className="mr-4 p-2 border rounded"
              />
              <button
                onClick={handleUploadFunds}
                className="flex items-center px-4 py-2 bg-[#001F54] text-white rounded-md hover:bg-[#001F54]/90 transition-colors"
              >
                <Upload size={20} className="mr-2" />
                Upload Funds
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex flex-wrap justify-between items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search pledges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#001F54]"
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <button
                onClick={handleExportData}
                className="flex items-center px-4 py-2 bg-[#001F54] text-white rounded-md hover:bg-[#001F54]/90 transition-colors"
              >
                <Download size={20} className="mr-2" />
                Export Data
              </button>
              <button
                onClick={handleRefreshData}
                className="flex items-center px-4 py-2 bg-gray-200 text-[#001F54] rounded-md hover:bg-gray-300 transition-colors"
              >
                <RefreshCw size={20} className="mr-2" />
                Refresh
              </button>
            </div>
          </div>

          {/* Pledge Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <table className="w-full border-collapse">
              <thead className="bg-[#001F54] text-white">
                <tr>
                  <th className="p-3 text-left">ETA CLASS MEMBER</th>
                  <th className="p-3 text-left">GOAL</th>
                  <th className="p-3 text-left">PROGRESS</th>
                  <th className="p-3 text-left">DATE COMPLETED</th>
                </tr>
              </thead>
              <tbody>
                {filteredPledges.map((pledge: Pledge, index: number) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 last:border-b-0"
                  >
                    <td className="p-3">{renderCell(pledge, index, "name")}</td>
                    <td className="p-3">{renderCell(pledge, index, "goal")}</td>
                    <td
                      className={`p-3 ${
                        pledge.progress === 0
                          ? "bg-red-100"
                          : pledge.progress < 50
                          ? "bg-yellow-100"
                          : "bg-green-100"
                      }`}
                    >
                      {renderCell(pledge, index, "progress")}
                    </td>
                    <td className="p-3">
                      {renderCell(pledge, index, "dateCompleted")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              className="bg-white rounded-lg shadow-md p-6"
              ref={containerRef}
            >
              <h2 className="text-2xl font-semibold text-[#001F54] mb-4">
                Progress Chart
              </h2>
              <BarChart
                xAxis={[
                  {
                    id: "name",
                    data: pledgeData.pledgeClass.map(
                      (pledge) => pledge.name.split(" ")[0]
                    ),
                    scaleType: "band",
                    label: "Pledge Class",
                    labelStyle: { fontSize: 14 },
                    tickLabelStyle: {
                      fontSize: 12,
                      angle: 45,
                      textAnchor: "start",
                    },
                  },
                ]}
                yAxis={[
                  {
                    label: "Funds Raised ($)",
                    labelStyle: { fontSize: 14, margin: 16 },
                    tickLabelStyle: { fontSize: 12 },
                  },
                ]}
                series={[
                  {
                    data: pledgeData.pledgeClass.map(
                      (pledge) => pledge.progress
                    ),
                    label: "Progress",
                    color: "#001F54",
                  },
                ]}
                width={chartWidth / 2 - 20}
                height={(chartWidth / 2 - 20) * 0.75}
                margin={{ left: 60, bottom: 60, right: 20, top: 20 }}
                slotProps={{ legend: { hidden: true } }}
              />
            </div>

            <div
              className="bg-white rounded-lg shadow-md p-6"
              ref={containerRef}
            >
              <h2 className="text-2xl font-semibold text-[#001F54] mb-4">
                Fundraising Progress
              </h2>
              <div className="flex flex-col items-center justify-between">
                <PieChart
                  series={[{ data: pieChartData }]}
                  width={chartWidth / 2 - 20}
                  height={(chartWidth / 2 - 20) * 0.75}
                />
                <div className="flex flex-col gap-2 text-lg mt-4">
                  <p className="font-semibold">
                    Total Goal: {formatter.format(pledgeData.totalToRaise)}
                  </p>
                  <p className="text-[#001F54]">
                    Raised: {formatter.format(totalRaised)}
                  </p>
                  <p className="text-gray-500">
                    Remaining: {formatter.format(remainingToRaise)}
                  </p>
                  <p>
                    Progress:{" "}
                    {((totalRaised / pledgeData.totalToRaise) * 100).toFixed(1)}
                    %
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Last Updated Timestamp */}
          <div className="mt-6 text-right text-gray-500">
            Last updated: {lastUpdated}
          </div>
        </>
      )}

      {activeTab === "leaderboard" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-[#001F54] mb-4">
            Leaderboard
          </h2>
          <table className="w-full border-collapse">
            <thead className="bg-[#001F54] text-white">
              <tr>
                <th className="p-3 text-left">Rank</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Progress</th>
                <th className="p-3 text-left">Goal</th>
              </tr>
            </thead>
            <tbody>
              {getLeaderboardData().map((pledge, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 last:border-b-0"
                >
                  <td className="p-3">
                    {index + 1}
                    {index === 0 && (
                      <span className="ml-2 text-yellow-500">🏆</span>
                    )}
                    {index === 1 && (
                      <span className="ml-2 text-gray-400">🥈</span>
                    )}
                    {index === 2 && (
                      <span className="ml-2 text-orange-400">🥉</span>
                    )}
                  </td>
                  <td className="p-3">{pledge.name}</td>
                  <td className="p-3">{formatter.format(pledge.progress)}</td>
                  <td className="p-3">{formatter.format(pledge.goal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
