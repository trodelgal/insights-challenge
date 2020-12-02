import React, { memo, useEffect, useState, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
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

export default memo(function TimeLine() {
  const classes = useStyles();
  const [chartData, setChartData] = useState();
  const getChartData = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/analitics/time");
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
      <h3>Distribution of posts during the day</h3>
      <ResponsiveContainer width={"100%"} height={200}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="posts"
            stroke="#8884d8"
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
});
