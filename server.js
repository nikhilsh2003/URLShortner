const express = require(`express`);
const app = express();
const mongoose = require(`mongoose`);
const reactDom = require("react-dom");
const ShortURL = require(`./models/shortURL`);

const port = process.env.PORT || 3000;

mongoose.connect(
  "mongodb+srv://<username>:<password>@cluster0.sxabv.mongodb.net/?retryWrites=true&w=majority"
);

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get(`/`, async (req, res) => {
  const shortURLs = await ShortURL.find();
  res.render("index", { shortURLs: shortURLs });
});

app.post(`/shortURLs`, async (req, res) => {
  await ShortURL.create({
    full: req.body.fullURL,
  });
  res.redirect(`/`);
});

app.get(`/:shortURL`, async (req, res) => {
  const shortURL = await ShortURL.findOne({ short: req.params.shortURL });
  if (shortURL == null) return res.sendStatus(404);
  shortURL.clicks++;
  shortURL.save();
  res.redirect(shortURL.full);
});

app.listen(port, () => {
  console.log(`App is listening at port ${port}`);
});
