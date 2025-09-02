const express = require("express");
const path = require("path");
const app = express();
const Stripe = require("stripe");

// Use the Stripe secret key from env
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Serve static files like index.html, JS, CSS
app.use(express.static(path.join(__dirname))); // ✅ static assets
app.use(express.json()); // ✅ parse JSON

// Serve index.html from root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Handle PaymentIntent creation
app.post("/create-intent", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 50000, // $500 in cents
      currency: "usd",
      capture_method: "manual",
      payment_method_types: ["card"],
    });

    res.send({ client_secret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: error.message });
  }
});

// Listen on Render's provided port
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
