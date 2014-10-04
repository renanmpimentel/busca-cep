exports.notFound = function(req, res, next) {
  res.status(404);
  res.json({error: 'page not-found'});
}

exports.serverError = function(error, req, res, next) {
  res.status(500);
  res.json({error: error});
}
