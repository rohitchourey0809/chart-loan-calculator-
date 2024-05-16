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
  const [loanAmount, setLoanAmount] = useState(6600000);
  const [interestRate, setInterestRate] = useState(15);
  const [loanDuration, setLoanDuration] = useState(10);
  const [courseDuration, setCourseDuration] = useState(24);
  const [gracePeriod, setGracePeriod] = useState(6);
  const [emi, setEmi] = useState(0);
  const [principalAmount, setPrincipalAmount] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

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
  }, [loanAmount, interestRate, loanDuration]);

  const data = [
    { name: "Loan Amount", value: loanAmount },
    { name: "Interest Rate", value: interestRate },
    { name: "Loan Duration", value: loanDuration },
    { name: "Course Duration", value: courseDuration },
    { name: "Grace Period", value: gracePeriod },
  ];

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div
      className={`flex flex-col justify-center items-center w-full h-full px-8 py-10 ${
        isDarkMode ? "bg-gray-900 text-gray-900" : "bg-green-600 text-black"
      }`}
    >
      <div className="container max-w-lg bg-white rounded-lg shadow-lg mb-4 px-4 py-8">
        <h1 className="text-3xl font-bold mb-2 text-center">
          Loan Repayment Calculator
        </h1>
        <p className="text-gray-600 text-center mb-4">
          The displayed EMI amount is approximate & is subject to change based
          on various factors.
        </p>
      </div>
      <div className="container bg-white rounded-lg shadow-lg mb-4 p-8">
        <div className="grid grid-cols-3 gap-4">
          {/* Input Section */}
          <div className="shadow-l">
            {data.map((item, index) => (
              <div key={index} className="">
                <label className="block mb-2">{item.name}</label>
                <input
                  type="range"
                  min="0"
                  max={item.name === "Loan Amount" ? "10000000" : "30"}
                  value={item.value}
                  onChange={(e) => {
                    switch (item.name) {
                      case "Loan Amount":
                        setLoanAmount(e.target.value);
                        break;
                      case "Interest Rate":
                        setInterestRate(e.target.value);
                        break;
                      case "Loan Duration":
                        setLoanDuration(e.target.value);
                        break;
                      case "Course Duration":
                        setCourseDuration(e.target.value);
                        break;
                      case "Grace Period":
                        setGracePeriod(e.target.value);
                        break;
                      default:
                        break;
                    }
                  }}
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
          {/* Chart Section */}
          <div className="shadow-lg">
            <center>
              <h2 className="text-xl font-bold mb-4">Result</h2>
              <p className="mb-2">
                <span className="font-semibold">Principal Amount:</span> ₹
                {principalAmount}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Total Interest:</span> ₹
                {totalInterest}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Total Amount:</span> ₹
                {totalAmount}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Monthly EMI:</span> ₹{emi}
              </p>
            </center>
          </div>
          <div className="shadow-l">
            <center>
              {" "}
              <LineChart width={400} height={400} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </center>
          </div>
        </div>
      </div>
      <div>
        <div>
          {" "}
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
    </div>
  );
}

export default LoanPaymentCalculator;
