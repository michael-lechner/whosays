var main = module.exports = {
    game: function(req, res){
        res.render('game.jade');
    },
    about: function(req, res){
        res.render('about.jade')
    }
};