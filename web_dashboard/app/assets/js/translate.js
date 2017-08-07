var Translate = function() {};
Translate.prototype.apply = function() {
    var trans_dict = JSON.parse(localStorage.getItem("translate"));
    var elements_to_translate = $("[translate]");
    var current_language = localStorage.getItem("lang");

    for (var i = 0; i < elements_to_translate.length; i++) {
        var current_element = $(elements_to_translate[i]);
        var current_trans_key = current_element.attr("translate");
        $(current_element).text(trans_dict[current_language][current_trans_key]);
        $(current_element).val(trans_dict[current_language][current_trans_key]);
    }
};

Translate.prototype.loadDictionary = function(dictionary) {
    localStorage.setItem("translate", JSON.stringify(dictionary));
};

Translate.prototype.setDefaultLanguage = function () {
    if (!localStorage.getItem("lang")) {
        localStorage.setItem("lang", "en");
    }
};

Translate.prototype.changeLanguage = function (language) {
    localStorage.setItem("lang", language);
    this.apply();
};

var translate = new Translate();
