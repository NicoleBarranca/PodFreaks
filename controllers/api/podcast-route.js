const router = require("express").Router();
const { Podcast, Comment, User, Genre } = require("../../models/");

// get all podcasts
router.get("/", (req, res) => {
  Podcast.findAll({
    attributes: ["id", "title", "creator", "description", "genre_id"],
    include: [
      {
        model: Genre,
        attributes: ["id", "genre_name"],
      },
      {
        model: Comment,
        attributes: { exclude: ["updatedAt"] },
        include: [
          {
            model: User,
            attributes: ["username"],
          },
        ],
      },
    ],
  })
    .then((podcast) => res.json(podcast))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//get single podcast
router.get("/:id", (req, res) => {
  Podcast.findOne({
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: Genre,
      },
      {
        model: Comment,
        attributes: { exclude: ["updatedAt"] },
        include: {
          model: User,
          attributes: ["username"],
        },
      },
    ],
  })
    .then((podcast) => {
      if (!podcast) {
        res.status(404).json({ message: "No podcast found with that id" });
        return;
      }
      res.json(podcast);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// add a new podcast
router.post("/", (req, res) => {
  Podcast.create(req.body)
    .then((newPod) => res.json(newPod))
    .catch((err) => {
      console.log(err);
    });
});

// update podcast
router.put("/:id", (req, res) => {
  Podcast.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((updatedPod) => {
      if (!updatedPod[0]) {
        res.status(404).json({ message: "No podcast found with that id" });
        return;
      }
      res.json({
        affectedCount: updatedPod,
        message: "Podcast updated!",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// delete podcast
router.delete("/:id", (req, res) => {
  Podcast.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((deletedPod) => {
      if (!deletedPod) {
        res.status(404).json({ message: "No podcast found with this id" });
        return;
      }
      res.json({ message: "Podcast deleted!" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
