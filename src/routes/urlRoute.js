import express from "express";
import { nanoid } from "nanoid";
import { validateUrl } from "../utils/utils.js";
import URL from "../models/URL.js";

const router = express.Router();

router.post("/short", async (req, res) => {
  const { url, buisnessBaseUrl } = req.body,
    urlId = nanoid();

  if (validateUrl(url)) {
    try {
      const existUrl = await URL.findOne({ originalUrl: url });

      if (existUrl) {
        res.send({
          msg: "URL already exist",
          data: existUrl,
        });
      } else {
        const base_url = buisnessBaseUrl || process.env.BASE || "https://xyz";

        const shortUrl = `${base_url}/${urlId}`;
        const newData = new URL({
          originalUrl: url,
          shortUrl,
          urlId,
        });

        await newData.save();
        res.send({
          msg: "URL saved!",
          data: newData,
        });
      }
    } catch (err) {
      console.log(err, "in shorting");
      res.status(500).send({ msg: "Server Error" });
    }
  } else {
    res.status(400).send({ msg: "Invalid Original Url", data: null });
  }
});

/**
 * @expected res
 * {
    "msg": "URL saved!",
    "data": {
        "urlId": "iN2qPKlAJlJD45GFbyc-0",
        "originalUrl": "https://stackoverflow.com/",
        "shortUrl": "https://brand.xz/iN2qPKlAJlJD45GFbyc-0",
        "clicks": 0,
        "_id": "64fc54acccf1cb147e2078bd",
        "date": "1694258348326",
        "__v": 0
    }
}
 */

router.get("/visit/:id", async (req, res) => {
  try {
    const existData = await URL.findById(req.params.id);
    if (existData) {
      await URL.updateOne({ $inc: { clicks: 1 } });

      return res.redirect(existData.originalUrl);
    } else res.status(404).json("Not found");
  } catch (err) {
    console.log(err, "on redirecting");
    res.status(500).json("Server Error");
  }
});

/**
 * @todo
 * on mail template we have to add the GET request along with primary key "_id"
 */

export default router;
