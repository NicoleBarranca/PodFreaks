const router = require("express").Router();
const { Genre, Podcast } = require("../../models/");

// All genres
router.get('/', (req, res) => {
    Genre.findAll({
      attributes: ['id', 'genre_name'],
      include: [
        {
          model: Podcast,
          attributes: ['id', 'title', 'creator', 'description', 'genre_id']
        }
      ]
    })
      .then(GenreInfo => res.json(GenreInfo))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

// Create a new genre
router.post('/', (req, res) => {
    Genre.create({
      genre_name: req.body.genre_name
    })
      .then(GenreInfo => res.json(GenreInfo))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

// Update a genre 
router.put('/:id', (req, res) => {
    Genre.update(req.body, {
      where: {
        id: req.params.id
      }
    })
      .then(GenreInfo => {
        if (!GenreInfo[0]) {
          res.status(404).json({ message: 'Cannot find genre with this id.' });
          return;
        }
        res.json(GenreInfo);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

// Delete a genre 
router.delete('/:id', (req, res) => {
    Genre.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(GenreInfo => {
        if (!GenreInfo) {
          res.status(404).json({ message: 'Cannot find genre with this id.' });
          return;
        }
        res.json(GenreInfo);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

module.exports = router;