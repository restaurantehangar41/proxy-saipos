import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.post("/saipos", async (req, res) => {
  try {
    const response = await fetch("https://api.saipos.com/SEU_ENDPOINT", {
      method: "POST",
      headers: {
        "Authorization": "Bearer SEU_TOKEN",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log("Proxy rodando"));
