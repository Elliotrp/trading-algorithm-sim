import Plot from "react-plotly.js";
import { SimulationResponse } from "../interfaces/simulation-response.interface";
import { isDarkMode } from "./dark-mode-provider.component";

interface Props {
   data: SimulationResponse;
}

function StockChart({ data }: Props) {
   if (data === undefined) {
      return;
   }

   const { Values, Buys, Sells } = data;

   const signalColours = Values.Signal.map((signal) => {
      if (signal >= 1) return "green";
      if (signal <= -1) return "red";
      return "yellow";
   });

   var isDarkTheme = isDarkMode();

   return (
      <Plot
         data={[
            {
               x: Values.Date,
               y: Values.Stock,
               type: "scatter",
               mode: "lines",
               name: "Stock Value",
               line: { color: "blue" },
               hovertemplate: "Date: %{x}<br>Stock price: %{y}<extra></extra>",
            },
            {
               x: Values.Date,
               y: Values.Value,
               type: "scatter",
               mode: "lines",
               name: "Portfolio Value",
               line: { color: "orange" },
               hovertemplate:
                  "Date: %{x}<br>Portfolio value: %{y}<extra></extra>",
            },
            {
               x: Buys.Date,
               y: Buys.BuyPrice,
               z: Buys.Bought,
               type: "scatter",
               mode: "markers",
               name: "Buy Points",
               marker: { color: "green", symbol: "triangle-up", size: 10 },
               text: Buys.Bought,
               hovertemplate:
                  "Date: %{x}<br>Price: %{y}<br>Bought: %{text}<extra></extra>",
            },
            {
               x: Sells.Date,
               y: Sells.SellPrice,
               z: Sells.Sells,
               type: "scatter",
               mode: "markers",
               name: "Sell Points",
               marker: { color: "red", symbol: "triangle-down", size: 10 },
               text: Sells.Sells,
               hovertemplate:
                  "Date: %{x}<br>Price: %{y}<br>Sold: %{text}<extra></extra>",
            },
         ]}
         layout={{
            plot_bgcolor: isDarkTheme ? "#384151" : "#f3f4f6",
            paper_bgcolor: isDarkTheme ? "#384151" : "#f3f4f6",
            font: {
               color: isDarkTheme ? "#FFFFFF" : "#000000",
            },
            xaxis: {
               title: "Date",
               tickformat: "%Y-%m-%d",
               gridcolor: isDarkTheme ? "#444444" : "#e1e1e1",
               zerolinecolor: isDarkTheme ? "#444444" : "#e1e1e1",
               linecolor: isDarkTheme ? "#444444" : "#e1e1e1",
               tickcolor: isDarkTheme ? "#444444" : "#e1e1e1",
            },
            yaxis: {
               title: "Value",
               gridcolor: isDarkTheme ? "#444444" : "#e1e1e1",
               zerolinecolor: isDarkTheme ? "#444444" : "#e1e1e1",
               linecolor: isDarkTheme ? "#444444" : "#e1e1e1",
               tickcolor: isDarkTheme ? "#444444" : "#e1e1e1",
            },
            shapes: Values.Date.map((date, index) => ({
               type: "rect",
               x0: date,
               x1:
                  index < Values.Date.length - 1
                     ? Values.Date[index + 1]
                     : date,
               y0: 0,
               y1: 1,
               yref: "paper",
               fillcolor: signalColours[index],
               opacity: 0.2,
               line: {
                  width: 0,
               },
            })),
            showlegend: false,
            margin: {
               l: 60,
               t: 30,
            },
         }}
         style={{ width: "100%", height: "100%" }}
         config={{ responsive: true, autosizable: true }}
      />
   );
}

export default StockChart;
