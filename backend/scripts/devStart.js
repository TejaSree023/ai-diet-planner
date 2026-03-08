const killPort = require("kill-port");

const start = async () => {
  const port = Number(process.env.PORT || 5000);

  try {
    await killPort(port);
    console.log(`Freed port ${port} before server start`);
  } catch (error) {
    // Ignore when no process is running on the port.
  }

  require("../server");
};

start();
