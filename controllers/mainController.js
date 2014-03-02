var main = module.exports = {
    touchStart: function (req, res){
        res.render('touchStart.jade')
    },
    game: function(req, res){
        res.render('game.jade');
    },
    about: function(req, res){
        res.render('about.jade')
    }
};