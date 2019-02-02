const path = require("path");
const Umzug = require("umzug");

let umzug = new Umzug({
  logging: () => {
    //console.log(arguments);
    //console.dir( arguments );
  },
  migrations: {
    path: "./db/migrations",
    pattern: /\.js$/
  },
  upName: "up",
  downName: "down"
});

function logUmzugEvent(eventName) {
  return (name, migration) => {
    console.log(`${name} ${eventName}`)
  };
}

umzug.on("migrating", logUmzugEvent("migrating"));
umzug.on("migrated", logUmzugEvent("migrated"));
umzug.on("reverting", logUmzugEvent("reverting"));
umzug.on("reverted", logUmzugEvent("reverted"));

umzug.up().then(
  console.log("All migrations done")
);