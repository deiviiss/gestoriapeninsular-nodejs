//error 404

//dependends

const controller = {}

//404
controller.get404 = (req, res) => {
  res.render('404.hbs')
};

module.exports = controller;