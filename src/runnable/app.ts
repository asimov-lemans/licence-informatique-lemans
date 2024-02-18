import { Database, MongoClient } from "../deps.ts";
import { AppRunner } from "../runner.ts";

interface PlanningConnection {
  v2: Database;
}

class App extends AppRunner {
  planningConnection?: PlanningConnection;

  private async connectDatabase() {
    const mongoClient = new MongoClient();

    this.planningConnection = {
      v2: await mongoClient.connect({
        db: "planning-v2",
        tls: true,
        servers: this.env.MONGO_DB_HOSTS.split(",").map((host) => ({
          host: host,
          port: parseInt(this.env.MONGO_DB_PORT),
        })),
        credential: {
          username: this.env.MONGO_DB_USERNAME,
          password: this.env.MONGO_DB_PASSWORD,
          db: "planning-v2",
          mechanism: "SCRAM-SHA-1",
        },
      }),
    };
  }

  async init() {
    await this.connectDatabase();
  }
}

export default App;
