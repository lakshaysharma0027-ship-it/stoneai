import DodoPayments from "dodopayments";

const bearerToken = process.env.DODO_API_KEY;
const client = new DodoPayments({
  bearerToken,
  environment: process.env.DODO_ENVIRONMENT === "test_mode" ? "test_mode" : "live_mode",
});

for await (const product of client.products.list()) {
  console.log(JSON.stringify({ id: product.product_id, name: product.name, price: product.price }));
}
