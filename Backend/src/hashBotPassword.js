const bcrypt = require("bcryptjs");

async function run() {
  const plain = "ChangeThisBotPassword123!";
  const hash = await bcrypt.hash(plain, 10);
  console.log(hash);
}

run();
