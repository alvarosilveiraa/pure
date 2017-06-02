var Teste = (function () {
    function Teste() {
        this.name = "Alvaro";
    }
    Teste.prototype.alertName = function () {
        alert(this.name);
    };
    return Teste;
}());
var teste = new Teste();
teste.alertName();
teste.name = "josé";
console.log(teste.name);
