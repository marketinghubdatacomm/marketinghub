function doGet(e) {
  return HtmlService.createTemplateFromFile('UI/Login').evaluate().setTitle('Marketing Hub Login');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
