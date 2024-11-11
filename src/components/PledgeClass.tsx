import { useState, useEffect, useRef } from 'react';
import {BarChart, PieChart} from "@mui/x-charts";

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
            goal: 50.00,
            progress: 0.00,
            dateCompleted: ""
        },
        {
            name: "Adithi Gudipati",
            goal: 50.00,
            progress: 0.00,
            dateCompleted: ""
        },
        {
            name: "Austin Miller",
            goal: 50.00,
            progress: 0.00,
            dateCompleted: ""
        },
        {
            name: "Constanza Loza",
            goal: 50.00,
            progress: 33.00,
            dateCompleted: "11/08"
        },
        {
            name: "Maddie Guzman",
            goal: 50.00,
            progress: 0.00,
            dateCompleted: ""
        },
        {
            name: "Meaghan Gouws",
            goal: 50.00,
            progress: 80.00,
            dateCompleted: "11/08"
        },
        {
            name: "Sergio Rivas",
            goal: 50.00,
            progress: 0.00,
            dateCompleted: ""
        },
        {
            name: "Tristan Szilagyi",
            goal: 50.00,
            progress: 0.00,
            dateCompleted: ""
        }
    ]
};

const calculateTotalRaised = (pledgeClass: Pledge[]): number => {
    return pledgeClass.reduce((sum, pledge) => sum + pledge.progress, 0);
};

function PledgeClass() {
    const [pledgeData, setPledgeData] = useState<MockData>(mockData);
    const [chartWidth, setChartWidth] = useState<number>(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setChartWidth(containerRef.current.offsetWidth);
            }
        };

        // Initial width calculation
        updateWidth();

        // Add resize listener
        window.addEventListener('resize', updateWidth);

        // Cleanup
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    const [editing, setEditing] = useState<EditingState>({
        index: null,
        field: null,
        value: ''
    });

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    const handleChange = (index: number, field: PledgeField, value: string) => {
        const newPledgeData = { ...pledgeData };
        const numValue = parseFloat(value) || 0;

        switch (field) {
            case 'name': {
                newPledgeData.pledgeClass[index].name = value;
                break;
            }
            case 'goal': {
                newPledgeData.pledgeClass[index].goal = numValue;
                break;
            }
            case 'progress': {
                newPledgeData.pledgeClass[index].progress = numValue;

                if (numValue >= newPledgeData.pledgeClass[index].goal &&
                    !newPledgeData.pledgeClass[index].dateCompleted) {
                    const today = new Date();
                    newPledgeData.pledgeClass[index].dateCompleted =
                        `${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getDate().toString().padStart(2, '0')}`;
                }
                break;
            }
            case 'dateCompleted': {
                newPledgeData.pledgeClass[index].dateCompleted = value;
                break;
            }
        }

        setPledgeData(newPledgeData);
        setEditing(prev => ({ ...prev, value }));
    };

    const startEditing = (index: number, field: PledgeField, value: string) => {
        setEditing({
            index,
            field,
            value: field === 'progress' || field === 'goal' ? value.toString() : value
        });
    };

    const stopEditing = () => {
        setEditing({ index: null, field: null, value: '' });
    };

    const totalRaised = calculateTotalRaised(pledgeData.pledgeClass);
    const remainingToRaise = pledgeData.totalToRaise - totalRaised;

    const pieChartData = [
        {
            id: 0,
            value: totalRaised,
            label: 'Total Raised',
            color: '#9333ea', // Purple to match the bar chart
        },
        {
            id: 1,
            value: remainingToRaise,
            label: 'Remaining',
            color: '#e4e4e7', // Light gray for remaining amount
        }
    ];

    const renderCell = (pledge: Pledge, index: number, field: PledgeField) => {
        const isEditing = editing.index === index && editing.field === field;

        if (isEditing) {
            switch (field) {
                case 'progress':
                case 'goal': {
                    return (
                        <input
                            type="number"
                            value={editing.value}
                            onChange={(e) => handleChange(index, field, e.target.value)}
                            onBlur={stopEditing}
                            className="w-24 bg-transparent"
                            step="0.01"
                            min="0"
                            max={field === 'progress' ? pledge.goal : undefined}
                            autoFocus
                        />
                    );
                }
                case 'dateCompleted': {
                    return (
                        <input
                            type="text"
                            value={editing.value}
                            onChange={(e) => handleChange(index, field, e.target.value)}
                            onBlur={stopEditing}
                            className="bg-transparent w-20"
                            placeholder="MM/DD"
                            pattern="\d{2}/\d{2}"
                            autoFocus
                        />
                    );
                }
                case 'name': {
                    return (
                        <input
                            type="text"
                            value={editing.value}
                            onChange={(e) => handleChange(index, field, e.target.value)}
                            onBlur={stopEditing}
                            className="bg-transparent w-full"
                            autoFocus
                        />
                    );
                }
            }
        }

        const displayValue = field === 'progress' || field === 'goal'
            ? formatter.format(pledge[field])
            : pledge[field];

        return (
            <div
                onClick={() => startEditing(index, field, pledge[field].toString())}
                className="cursor-pointer"
            >
                {displayValue}
            </div>
        );
    };

    return (
        <div className="p-6">
            <h1 className="text-5xl mb-6">Eta Class</h1>
            <h1 className="text-2xl mb-6">
                Total Raised: {formatter.format(calculateTotalRaised(pledgeData.pledgeClass))}
            </h1>
            <h1 className="text-2xl mb-6">
                Goal: {formatter.format(pledgeData.totalToRaise)}
            </h1>

            <table className="w-full border-collapse">
                <thead className="bg-purple-600 text-white">
                <tr>
                    <th className="border p-2 text-left">ETA CLASS MEMBER</th>
                    <th className="border p-2 text-left">GOAL</th>
                    <th className="border p-2 text-left">PROGRESS</th>
                    <th className="border p-2 text-left">DATE COMPLETED</th>
                </tr>
                </thead>
                <tbody>
                {pledgeData.pledgeClass.map((pledge: Pledge, index: number) => (
                    <tr key={index}>
                        <td className="border p-2">
                            {renderCell(pledge, index, 'name')}
                        </td>
                        <td className="border p-2">
                            {renderCell(pledge, index, 'goal')}
                        </td>
                        <td className={`border p-2 ${
                            pledge.progress === 0 ? 'bg-red-400' :
                                pledge.progress < 50 ? 'bg-green-400' :
                                    'bg-teal-400'
                        }`}>
                            {renderCell(pledge, index, 'progress')}
                        </td>
                        <td className="border p-2">
                            {renderCell(pledge, index, 'dateCompleted')}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="mt-20 w-[90%]" ref={containerRef}>
                <h2 className="mb-10 text-2xl">Progress Chart</h2>
                <BarChart
                    xAxis={[{
                        id: 'name',
                        data: pledgeData.pledgeClass.map(pledge => pledge.name.split(' ')[0]), // Get first name only
                        scaleType: 'band',
                        label: 'Pledge Class',
                        labelStyle: {
                            fontSize: 16,
                        },
                        tickLabelStyle: {
                            fontSize: 16,
                        }
                    }]}
                    yAxis={[{
                        label: 'Funds Raised ($)',
                        labelStyle: {
                            fontSize: 16,
                            margin: 20,
                        },
                        tickLabelStyle: {
                            fontSize: 12,
                        }
                    }]}
                    margin={{
                        left: 80,    // Add left margin for y-axis label
                        bottom: 80,  // Add bottom margin for rotated x-axis labels
                        right: 20,   // Add right margin
                        top: 20      // Add top margin
                    }}
                    series={[{
                        data: pledgeData.pledgeClass.map(pledge => pledge.progress),
                        label: 'Progress',
                        color: '#9333ea'
                    }]}
                    width={chartWidth}
                    height={chartWidth * .5}
                    slotProps={{
                        legend: {
                            hidden: false,
                        }
                    }}
                    tooltip={{trigger: 'axis'}}
                />
            </div>
            <div className="mt-20 w-[90%]" ref={containerRef}>
                <h2 className="mb-10 text-2xl">Fundraising Progress</h2>
                <div className="flex flex-row">
                    <PieChart
                        series={[
                            {
                                data: pieChartData,
                            },
                        ]}
                        width={600}
                        height={250}
                        margin={{right: 100}}

                    />
                    <div className="flex flex-col gap-2 text-lg">
                            <p className="font-semibold">Total Goal: {formatter.format(pledgeData.totalToRaise)}</p>
                            <p className="text-purple-600">Raised: {formatter.format(totalRaised)}</p>
                            <p className="text-gray-500">Remaining: {formatter.format(remainingToRaise)}</p>
                            <p>Progress: {((totalRaised / pledgeData.totalToRaise) * 100).toFixed(1)}%</p>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default PledgeClass;