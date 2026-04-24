import express from "express";

const app = express();
app.use(express.json());

// 🔐 variáveis de ambiente
const SAIPOS_BASE_URL = process.env.SAIPOS_BASE_URL;
const SAIPOS_TOKEN = process.env.SAIPOS_TOKEN;

// ✅ rota principal (teste)
app.get("/", (req, res) => {
  res.send("✅ Proxy SAIPOS rodando");
});

// 🚀 proxy
app.all("/saipos/*", async (req, res) => {
  try {
    const endpoint = req.params[0];

    const response = await fetch(`${SAIPOS_BASE_URL}/${endpoint}`, {
      method: req.method,
      headers: {
        "Authorization": `Bearer ${SAIPOS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: ["GET", "DELETE"].includes(req.method)
        ? undefined
        : JSON.stringify(req.body)
    });

    const data = await response.text();
    res.status(response.status).send(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🚪 porta obrigatória
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Rodando na porta ${PORT}`);
});
