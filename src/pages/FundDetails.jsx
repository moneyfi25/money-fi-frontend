import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMutualFundDetails } from "../services/middleware";

const FundDetailsPage = () => {
  const { fundName } = useParams();
  const [fund, setFund] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log("first");
  useEffect(() => {
    const fetchFund = async () => {
      try {
        const response = await getMutualFundDetails(fundName);
        console.log(response.data);
        setFund(response.data.mutual_fund);
      } catch (err) {
        setFund(null);
      } finally {
        setLoading(false);
      }
    };
    fetchFund();
  }, [fundName]); // <-- Add fundName here

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{fund.fund_name}</h1>
      <p>{fund.advisor_reason}</p>
    </div>
  );
};

export default FundDetailsPage;
