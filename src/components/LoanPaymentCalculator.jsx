import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

function LoanPaymentCalculator() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loanAmount, setLoanAmount] = useState(100000);
  const [interestRate, setInterestRate] = useState(1);
  const [loanDuration, setLoanDuration] = useState(1);
  const [courseDuration, setCourseDuration] = useState(0);
  const [gracePeriod, setGracePeriod] = useState(0);
  const [emi, setEmi] = useState(0);
  const [principalAmount, setPrincipalAmount] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [data, setData] = useState([]);

  useEffect(() => {
    const userPreference = localStorage.getItem("darkMode");
    if (userPreference === "dark") {
      setIsDarkMode(true);
    } else if (userPreference === "light") {
      setIsDarkMode(false);
    } else {
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        setIsDarkMode(true);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", isDarkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const monthlyInterestRate = interestRate / (12 * 100);
    const totalMonths = loanDuration * 12;
    const emiValue =
      (loanAmount *
        monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, totalMonths)) /
      (Math.pow(1 + monthlyInterestRate, totalMonths) - 1);
    setEmi(emiValue.toFixed(2));

    const principalValue = emiValue * totalMonths;
    setPrincipalAmount(principalValue.toFixed(2));

    const totalInterestValue = principalValue - loanAmount;
    setTotalInterest(totalInterestValue.toFixed(2));

    const totalAmountValue =
      parseFloat(principalValue) + parseFloat(totalInterestValue);
    setTotalAmount(totalAmountValue.toFixed(2));

    // Generate data for the chart
    const chartData = Array.from({ length: totalMonths }, (_, index) => ({
      month: index + 1,
      emi: emiValue,
    }));
    setData(chartData);
  }, [loanAmount, interestRate, loanDuration]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleInputChange = (name, value) => {
    const intValue = parseInt(value, 10);
    switch (name) {
      case "Loan Amount":
        setLoanAmount(intValue);
        break;
      case "Interest Rate":
        setInterestRate(intValue);
        break;
      case "Loan Duration":
        setLoanDuration(intValue);
        break;
      case "Course Duration":
        setCourseDuration(intValue);
        break;
      case "Grace Period":
        setGracePeriod(intValue);
        break;
      default:
        break;
    }
  };

  return (
    <div
      className={`flex flex-col justify-center items-center bg-white shadow-lg w-full h-full px-8 py-10 ${
        isDarkMode ? "bg-gray-900 text-gray-900" : "bg-green-600 text-black"
      }`}
    >
      <div className="container max-w-lg  rounded-lg  mb-4 px-4 py-8">
        <h1 className="text-3xl font-bold mb-2 text-center">
          Loan Repayment Calculator
        </h1>
        <p className="text-gray-600 text-center mb-4">
          The displayed EMI amount is approximate & is subject to change based
          on various factors.
        </p>
      </div>
      <div className="container bg-white rounded-lg  mb-4 p-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
          {/* Input Section */}
          <div className="shadow-lg p-4">
            {[
              {
                name: "Loan Amount",
                value: loanAmount,
                min: 100000,
                max: 10000000,
              },
              { name: "Interest Rate", value: interestRate, min: 1, max: 30 },
              { name: "Loan Duration", value: loanDuration, min: 1, max: 30 },
              {
                name: "Course Duration",
                value: courseDuration,
                min: 0,
                max: 30,
              },
              { name: "Grace Period", value: gracePeriod, min: 0, max: 24 },
            ].map((item, index) => (
              <div key={index} className="mb-4">
                <label className="block mb-2">{item.name}</label>
                <input
                  type="range"
                  min={item.min}
                  max={item.max}
                  value={item.value}
                  onChange={(e) => handleInputChange(item.name, e.target.value)}
                  className={`w-full appearance-none h-2 rounded-lg outline-none transition-all duration-300 ease-in-out ${
                    isDarkMode ? "bg-red-600" : "bg-custom-color-1"
                  } ${isDarkMode ? "text-green-600" : "text-custom-color-1"}`}
                />
                <span
                  className={`block text-center ${
                    isDarkMode ? "text-green" : "text-black"
                  }`}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
          {/* Result Section */}
          <div className=" p-4">
            <center>
              <h2 className="text-xl font-bold mb-4">Result</h2>
              <p className="mb-2">
                <span className="font-semibold">Principal Amount:</span>
                <br />₹{principalAmount}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Total Interest:</span>
                <br />₹{totalInterest}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Total Amount:</span> <br /> ₹
                {totalAmount}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Monthly EMI:</span> <br />₹{emi}
              </p>
            </center>
          </div>
          {/* Chart Section */}
          <div className=" p-4 overflow-auto">
            <center>
              <div className="chart-container">
                <LineChart width={300} height={300} data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="emi" stroke="#8884d8" />
                </LineChart>
              </div>
            </center>
          </div>
        </div>
      </div>
      <div>
        <button
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
            isDarkMode ? "bg-gray-700" : "bg-blue-500"
          }`}
          onClick={toggleDarkMode}
        >
          {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </button>
      </div>
    </div>
  );
}

export default LoanPaymentCalculator;
