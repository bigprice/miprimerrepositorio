var Observable = function() {
    this.observers = [];

    this.add = function(observer) {
        this.observers.push(observer);
    };

    this.notify = function(obj) {
        this.observers.forEach(function(observer) {
            observer.call(null, obj);
        }, this);
    };

}

var Mensualidad = function(interes, hasIvaInteres, porcentajeIva) {
    this.observable = new Observable();
    this.interes = interes;
    this.hasIvaInteres = hasIvaInteres;
    this.porcentajeIva = porcentajeIva;

    this.CalcularIvaInteres = function() {
        var iva = 0;
        if (hasIvaInteres) {
            iva = interes * porcentajeIva;

            this.observable.notify({
                interes: interes,
                iva: iva
            });
        }

        return iva;
    };
};

var mes = new Mensualidad(100, true, 0.16);

mes.observable.add(function(obj) {
    console.log('Iva : ' + obj.iva);
})

mes.CalcularIvaInteres();
console.log('--------------------------------------------')

var MensualidadLineaCredito = function(interes, hasIvaInteres) {
    var self = this;


    this.CalcularIvaInteres = function(porcentajeIva) {
        var iva = 0;
        if (hasIvaInteres) {
            iva = interes * porcentajeIva;
        }

        return iva;
    };

    this.CalcularTotal = function(porcentajeIva) {
        var total = this.CalcularIvaInteres(porcentajeIva) + interes;
        return total;
    };


}

var MensualidadLineaCreditoDos = function(interes, porcentajeIva, hasIvaInteres) {

    var ivaChanged = [];
    var totalChanged = [];

    this.interes = function(val) {
        return interes;
    };

    this.hasIvaInteres = function(val) {
        return hasIvaInteres;
    };

    this.porcentajeIva = function(val) {
        return porcentajeIva;
    };

    this.iva = function(val) {
        var iva = 0.0;
        if (val != undefined) { //&& val != interes) {

            if (hasIvaInteres) {
                iva = interes * porcentajeIva;
            }

            for (var i = 0; i < ivaChanged.length; i++) {
                ivaChanged[i](this);
            }

        }

        return iva;
    };

    this.total = function(val) {
        var total = 0.0;
        if (val != undefined) { //&& val != interes) {
            var total = this.iva(val) + interes;

            for (var i = 0; i < totalChanged.length; i++) {
                totalChanged[i](this);
            }
        }

        return total;
    };


    this.onIvaChanged = function(callback) {
        ivaChanged.push(callback);
    };

    this.onTotalChanged = function(callback) {
        totalChanged.push(callback);
    };

}

console.log('Iva del interes: ' + new MensualidadLineaCredito(100, true).CalcularIvaInteres(0.16));
console.log('total: ' + new MensualidadLineaCredito(100, true).CalcularTotal(0.16));

var mensualidad = new MensualidadLineaCreditoDos(1000, 0.16, true);

mensualidad.onIvaChanged(function(b) {
    console.log('Iva: $' + b.iva());
});


mensualidad.onTotalChanged(function(b) {
    console.log('total: $' + b.total());
});
console.log('--------------------------------------------')
mensualidad.iva(1000);
mensualidad.total(1000);

var newObject = new Object();
Object.defineProperty(newObject, "propiedad1", {
    value: "example of value of a property",


});