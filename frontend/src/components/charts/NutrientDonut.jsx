import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const NutrientDonut = ({ title, value, target = 100, color = "#8FAF8D" }) => {
  const safeTarget = target > 0 ? target : 100;
  const percent = Math.max(0, Math.min(100, Math.round((value / safeTarget) * 100)));
  const status = percent >= 95 ? "On target" : percent >= 70 ? "In range" : "Below target";

  const data = [
    { name: "progress", value: percent },
    { name: "rest", value: 100 - percent },
  ];

  return (
    <div className="card hover-card p-4 chart-card">
      <p className="text-sm font-medium text-[#7A5D4A]">{title}</p>
      <div className="mt-2 flex flex-col items-center">
        <div className="relative h-28 w-28">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" innerRadius={30} outerRadius={42} stroke="none" startAngle={90} endAngle={-270}>
                <Cell fill={color} />
                <Cell fill="#EFE5D6" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="donut-center-label">
            <p className="text-[30px] font-semibold leading-none text-[#5D4436]">{percent}%</p>
          </div>
        </div>
        <p className="mt-1 text-[11px] text-[#8C6A54]">{status}</p>
      </div>
      <p className="mt-1 text-center text-xs text-[#8C6A54]">{value.toFixed(0)} / {safeTarget.toFixed(0)}</p>
    </div>
  );
};

export default NutrientDonut;
