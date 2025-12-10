// /api/create-checkout.js

export default async function handler(req, res) {
    // CORS（GitHub Pages など外部からでも使えるようにする）
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    // これを必ず Vercel の環境変数に設定する（後で説明）
    const API_KEY = process.env.PADDLE_API_KEY;

    const body = JSON.parse(req.body || "{}");

    // item.priceId をフロントから受け取る
    const priceId = body.priceId;

    if (!priceId) {
        return res.status(400).json({ error: "priceId is required" });
    }

    // Paddle API に checkout session を作成
    const response = await fetch("https://sandbox-api.paddle.com/checkout/sessions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            items: [
                {
                    price_id: priceId,
                    quantity: 1
                }
            ]
        })
    });

    const data = await response.json();

    if (!response.ok) {
        return res.status(500).json({ error: data });
    }

    // session.id をフロントに返す
    return res.status(200).json({
        sessionId: data.data.id
    });
}
