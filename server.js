import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// 🔐 variáveis de ambiente
const SAIPOS_BASE_URL = process.env.SAIPOS_BASE_URL;
const SAIPOS_TOKEN = process.env.SAIPOS_TOKEN;

// 🧪 health check
app.get("/", (req, res) => {
  res.send("✅ Proxy SAIPOS rodando");
});

// 🌍 opcional: ver IP do servidor (debug)
app.get("/ip", async (req, res) => {
  try {
    const response = await fetch("https://ifconfig.me");
    const ip = await response.text();
    res.send(ip);
  } catch (err) {
    res.status(500).send("Erro ao obter IP");
  }
});

// 🚀 proxy principal
app.all("/saipos/*", async (req, res) => {
  try {
    const endpoint = req.params[0];

    // 🔥 query params (ESSENCIAL)
    const queryString = new URLSearchParams(req.query).toString();

    const url = `${SAIPOS_BASE_URL}/${endpoint}${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await fetch(url, {
      method: req.method,
      headers: {
        "Authorization": `Bearer ${SAIPOS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: ["GET", "DELETE"].includes(req.method)
        ? undefined
        : JSON.stringify(req.body)
    });

    const contentType = response.headers.get("content-type");

    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    res.status(response.status).send(data);

  } catch (error) {
    console.error("Erro no proxy:", error);

    res.status(500).json({
      error: "Erro no proxy",
      details: error.message
    });
  }
});

// 🚪 porta obrigatória
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Proxy rodando na porta ${PORT}`);
});
