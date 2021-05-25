const igClient = require("instagram-private-api");
const ig = new igClient.IgApiClient();
const cfg = require("./config.json");
ig.state.generateDevice(cfg.username);
(async () => {
  await ig.simulate.preLoginFlow();
  const loggedinUser = await ig.account.login(cfg.username, cfg.password);
  if (loggedinUser) {
    console.log(`Logged in as user ${loggedinUser.username}`);
  }
  setInterval(async () => {
    console.log("Getting posts");
    let feed = ig.feed.user(loggedinUser.pk);
    currentPage = await feed.items();
    if (Object.keys(currentPage).length === 0) {
      console.log("No posts left");
      process.exit();
    }
    for (let i of currentPage) {
      console.log(`Trying to delete IG Post: ${i.id}`);
      ig.media.delete(i.id);
    }
  }, 300000);
})();
