//Página principal

//dependends

const controller = {};

controller.getIndex = (req, res) => {
  res.render('index.hbs')
}

module.exports = controller;