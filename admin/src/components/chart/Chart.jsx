import "./chart.scss";
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useMemo, useState } from "react";
import axios from "../../axios";

// const data = [
//   { name: "January", Total: 1200 },
//   { name: "February", Total: 2100 },
//   { name: "March", Total: 800 },
//   { name: "April", Total: 1600 },
//   { name: "May", Total: 900 },
//   { name: "June", Total: 1700 },
// ];


const Chart = ({ aspect, title }) => {
  const [user, setUser] = useState([])
  const MONTHS = useMemo(
    () => [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    []
  );
  useEffect(() => {
    axios.get(`users/stats/1`,{withCredentials:true}).then((res)=>{
      const statsList = res.data.sort(function (a, b) {
        return a._id - b._id;
      });
      statsList.map((item) =>
        setUser((prev) => [
          ...prev,
          { name: MONTHS[item._id - 1], "New User": item.total },
        ])
      );
      
      return ()=>{
        setUser([])
      }

     }).catch((e)=>{
   console.log(e);
     })
  }, [])
  return (
    <div className="chart">
    {user.length!=0&&  <><div className="title">{title}</div>
    {console.log(user)}
      <ResponsiveContainer width="100%" aspect={aspect}>
        <AreaChart
          width={100}
          height={100}
          data={user}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="username" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke="gray" />
          <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="New User"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#username)"
          />
        </AreaChart>
      </ResponsiveContainer>
     </>
      }
     
    </div>
  );
};

export default Chart;
