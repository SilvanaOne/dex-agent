"use client";

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
  TimeScale,
  Filler,
} from "chart.js";
import { getEthPriceHistory } from "@dex-agent/lib";
import "chartjs-adapter-date-fns";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler
);

export default function TradingChart() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchPriceHistory = async () => {
      // // Generate mock data
      // const mockData = generateMockData()
      // const labels = mockData.map((_, index) => `${index}`)
      // const prices = mockData.map((item) => item.close)

      const priceHistory = await getEthPriceHistory();
      console.log("eth price history", priceHistory?.prices?.length);
      if (!priceHistory) return;
      const labels = priceHistory.prices.map((item) => new Date(item[0]));
      const prices = priceHistory.prices.map((item) => item[1]);

      setChartData({
        labels,
        datasets: [
          {
            label: "WETH/WUSD",
            data: prices,
            borderColor: "#1E80FF",
            backgroundColor: "rgba(30, 128, 255, 0.1)",
            tension: 0.4,
            fill: true,
          },
        ],
      } as any);
    };
    fetchPriceHistory();
  }, []);

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "hour",
          displayFormats: {
            hour: "HH:00",
          },
          stepSize: 1,
        },
        grid: {
          color: "rgba(42, 46, 55, 0.5)",
          drawBorder: false,
        },
        ticks: {
          color: "#848e9c",
          font: {
            size: 8,
          },
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 24,
        },
      },
      y: {
        grid: {
          color: "rgba(42, 46, 55, 0.5)",
          drawBorder: false,
        },
        ticks: {
          color: "#848e9c",
          font: {
            size: 8,
          },
        },
        position: "right",
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(22, 26, 30, 0.9)",
        titleColor: "#FFFFFF",
        bodyColor: "#848e9c",
        borderColor: "#2a2e37",
        borderWidth: 1,
        titleFont: {
          size: 10,
        },
        bodyFont: {
          size: 10,
        },
        padding: 6,
        displayColors: false,
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
    elements: {
      point: {
        radius: 0,
        hoverRadius: 3,
      },
      line: {
        borderWidth: 1.5,
      },
    },
  } as any;

  return (
    <div className="h-full w-full p-1 flex flex-col">
      <div className="flex justify-between items-center mb-0.5">
        <div className="flex space-x-1.5 text-[9px]">
          <button className="px-1 py-0.5 rounded bg-[#2a2e37] text-white">
            1m
          </button>
          <button className="px-1 py-0.5 rounded hover:bg-[#2a2e37] text-[#848e9c] transition-colors">
            5m
          </button>
          <button className="px-1 py-0.5 rounded hover:bg-[#2a2e37] text-[#848e9c] transition-colors">
            15m
          </button>
          <button className="px-1 py-0.5 rounded hover:bg-[#2a2e37] text-[#848e9c] transition-colors">
            1h
          </button>
          <button className="px-1 py-0.5 rounded hover:bg-[#2a2e37] text-[#848e9c] transition-colors">
            4h
          </button>
          <button className="px-1 py-0.5 rounded hover:bg-[#2a2e37] text-[#848e9c] transition-colors">
            1d
          </button>
        </div>
        <div className="flex space-x-1">
          <button className="text-[#848e9c] hover:text-white p-0.5 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 3h18v18H3z"></path>
              <path d="M21 9H3M21 15H3M12 3v18"></path>
            </svg>
          </button>
          <button className="text-[#848e9c] hover:text-white p-0.5 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 12h20M12 2v20"></path>
            </svg>
          </button>
        </div>
      </div>
      <div className="h-[calc(100%-14px)] w-full flex-1">
        {chartData.labels.length > 0 && (
          <Line options={options} data={chartData} />
        )}
      </div>
    </div>
  );
}

function generateMockData() {
  const data = [];
  const basePrice = 2000;

  for (let i = 0; i < 50; i++) {
    const volatility = 10;
    const open = basePrice + Math.random() * volatility * 2 - volatility;
    const close = open + Math.random() * volatility * 2 - volatility;
    const high = Math.max(open, close) + Math.random() * volatility;
    const low = Math.min(open, close) - Math.random() * volatility;

    data.push({
      open,
      high,
      low,
      close,
    });
  }

  return data;
}
