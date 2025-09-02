
const express = require("express");
const app = express();
const Stripe = require("stripe");

const path = require("path");

// Serve index.html on root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Use the Stripe secret key set as environment variable
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.use(express.static("."));
app.use(express.json());

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

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
