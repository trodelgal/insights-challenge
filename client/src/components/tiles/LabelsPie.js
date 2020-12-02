import React, { memo, useState, useEffect, useCallback } from "react";
import {
  PieChart,
  Pie,
  Legend,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import Card from "@material-ui/core/Card";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    width: "60%",
    border: "solid 1px black",
    margin: 5,
    opacity: 0.9,
  },
});

export default memo(function LabelsPie() {
  const classes = useStyles();
  const [chartData, setChartData] = useState();
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#000000"];
  const getChartData = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/analitics/labels");
      setChartData(data);
    } catch (err) {
      console.error(err);
    }
  });

  useEffect(() => {
    getChartData();
  }, []);

  return (
    <Card className={classes.root}>
      <h3>Distribution of posts by labels</h3>
      <ResponsiveContainer width={"100%"} height={300}>
        <PieChart>
          <Pie
            dataKey="count"
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {chartData &&
              chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
});
