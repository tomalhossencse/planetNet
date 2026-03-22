const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const admin = require("firebase-admin");
const stripe = require("stripe")(process.env.STRIPE_SCREET_KEY);
const port = process.env.PORT || 3000;

const decoded = Buffer.from(process.env.FB_SERVICE_KEY, "base64").toString(
  "utf-8",
);
const serviceAccount = JSON.parse(decoded);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
// middleware
app.use(
  cors({
    origin: [process.env.SITE_DOMAIN],
    credentials: true,
    optionSuccessStatus: 200,
  }),
);
app.use(express.json());

// jwt middlewares
const verifyJWT = async (req, res, next) => {
  const token = req?.headers?.authorization?.split(" ")[1];
  console.log(token);
  if (!token) return res.status(401).send({ message: "Unauthorized Access!" });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.tokenEmail = decoded.email;
    console.log(decoded);
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).send({ message: "Unauthorized Access!", err });
  }
};

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    const db = client.db("planetNet");
    const plantCollection = db.collection("plants");
    const orderCollection = db.collection("orders");

    // save a plant data in db
    app.post("/plants", async (req, res) => {
      const plantData = req.body;
      const result = await plantCollection.insertOne(plantData);
      res.send(result);
    });

    // get all plants from db
    app.get("/plants", async (req, res) => {
      const result = await plantCollection.find().toArray();
      res.send(result);
    });

    // get single plant

    app.get("/plants/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await plantCollection.findOne(query);
      res.send(result);
    });

    // payment endpoints

    app.post("/create-checkout-session", async (req, res) => {
      const paymentInfo = req.body;
      console.log(paymentInfo);
      // res.send(paymentInfo);

      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: "bdt",
              product_data: {
                name: paymentInfo?.name,
                description: paymentInfo?.description,
                images: [paymentInfo?.image],
              },
              unit_amount: paymentInfo?.price * 100,
            },

            quantity: paymentInfo?.quantity,
          },
        ],
        customer_email: paymentInfo?.customer?.email,

        mode: "payment",
        metadata: {
          plantId: paymentInfo?.plantId,
          customer: paymentInfo?.customer?.email,
        },

        success_url: `${process.env.SITE_DOMAIN}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.SITE_DOMAIN}/plant/${paymentInfo?.plantId}`,
      });

      res.send({ url: session.url });
    });

    app.post("/payment-success", async (req, res) => {
      const { sessionId } = req.body;
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      // console.log(session);

      const plant = await plantCollection.findOne({
        _id: new ObjectId(session.metadata.plantId),
      });

      const orderExist = await orderCollection.findOne({
        transactionId: session.payment_intent,
      });

      if (session.status === "complete" && plant && !orderExist) {
        // save order in db
        const orderInfo = {
          plantId: session.metadata.plantId,
          transactionId: session.payment_intent,
          customer: session.metadata.customer,
          status: "pending",
          name: plant.name,
          seller: plant.seller,
          price: session.amount_total / 100,
          category: plant.category,
          quantity: 1,
        };
        // console.log(orderInfo);
        const result = await orderCollection.insertOne(orderInfo);
        // update plant quantity
        await plantCollection.updateOne(
          {
            _id: new ObjectId(session.metadata.plantId),
          },
          {
            $inc: {
              quantity: -1,
            },
          },
        );

        return res.send({
          transactionId: session.payment_intent,
          orderId: result.insertedId,
        });
      }

      res.send({
        transactionId: session.payment_intent,
        orderId: order._id,
      });
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "✅Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello from Server..");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
