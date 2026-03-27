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
    const userCollection = db.collection("users");
    const sellerRequestCollection = db.collection("sellerRequests");

    // role middleware

    const verifyAdmin = async (req, res, next) => {
      const email = req.tokenEmail;
      const user = await userCollection.findOne({ email });
      if (user?.role !== "admin")
        return res.status(403).send({
          message: "Admin only Actions !",
          role: user?.role,
        });
      next();
    };

    const verifySeller = async (req, res, next) => {
      const email = req.tokenEmail;
      const user = await userCollection.findOne({ email });
      if (user?.role !== "seller")
        return res.status(403).send({
          message: "Seller only Actions !",
          role: user?.role,
        });
      next();
    };

    // save a plant data in db
    app.post("/plants", verifyJWT, verifySeller, async (req, res) => {
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
              currency: "usd",
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
      console.log(session);

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
          image: plant.image,
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

    // get all orders for a customer by email
    app.get("/my-orders/:email", verifyJWT, verifySeller, async (req, res) => {
      const email = req.params.email;
      const result = await orderCollection.find({ customer: email }).toArray();
      res.send(result);
    });

    // get all orders for a seller by email
    app.get("/manage-orders/:email", async (req, res) => {
      const email = req.params.email;
      const result = await orderCollection
        .find({ "seller.email": email })
        .toArray();
      res.send(result);
    });

    // get all plants for a seller by email
    app.get(
      "/my-inventory/:email",
      verifyJWT,
      verifySeller,
      async (req, res) => {
        const email = req.params.email;
        const result = await plantCollection
          .find({ "seller.email": email })
          .toArray();
        res.send(result);
      },
    );

    // delete plant
    app.delete("/my-inventory/:id", async (req, res) => {
      const id = req.params.id;
      const result = await plantCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    //save or update user in db

    app.post("/users", async (req, res) => {
      const userData = req.body;
      userData.created_at = new Date().toISOString();
      userData.last_loggedIn = new Date().toISOString();
      userData.role = "customer";

      const query = {
        email: userData.email,
      };

      const alreadyExists = await userCollection.findOne(query);
      console.log("users Already Exists ---------->", !!alreadyExists);

      if (alreadyExists) {
        console.log("updating user Info..........");

        const result = await userCollection.updateOne(query, {
          $set: {
            last_loggedIn: new Date().toISOString(),
          },
        });
        return res.send(result);
      }

      console.log("saving new user Info..........");
      const result = await userCollection.insertOne(userData);
      res.send(result);
    });

    // get a user's role

    app.get("/user/role", verifyJWT, async (req, res) => {
      // const email = req.params.email;
      const result = await userCollection.findOne({ email: req.tokenEmail });
      res.send({ role: result?.role });
    });

    // save become seller request

    app.post("/become-seller", verifyJWT, async (req, res) => {
      const email = req.tokenEmail;

      const alreadyExists = await sellerRequestCollection.findOne({ email });
      if (alreadyExists)
        return res
          .status(409)
          .send({ message: "Already request Send, Please Wait..." });
      const result = await sellerRequestCollection.insertOne({ email });
      res.send(result);
    });

    // get all seller request for admin
    app.get("/seller-requests", verifyJWT, verifyAdmin, async (req, res) => {
      const result = await sellerRequestCollection.find().toArray();
      res.send(result);
    });

    // get all user for admin
    app.get("/users", verifyJWT, verifyAdmin, async (req, res) => {
      const adminEmail = req.tokenEmail;

      const result = await userCollection
        .find({
          email: {
            $ne: adminEmail,
          },
        })
        .toArray();
      res.send(result);
    });

    // update a user role

    app.patch("/update-role", verifyJWT, async (req, res) => {
      const { email, role } = req.body;
      const result = await userCollection.updateOne(
        { email },
        { $set: { role } },
      );

      await sellerRequestCollection.deleteOne({ email });

      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "✅Pinged your deployment. You successfully connected to MongoDB!",
    // );
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
