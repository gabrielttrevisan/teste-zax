const HasId = class HasId {
    constructor(id) {
        this.id = id;
    }
};

const Motoboy = class Motoboy extends HasId {
    constructor(id, valor, loja) {
        super(id);
        this.valor = valor;
        this.loja = loja;
        this.pedidos = [];
    }

    addPedido(pedido) {
        this.pedidos = [ ...this.pedidos, pedido ];
        return this;
    }
};

const Pedido = class Pedido extends HasId {
    constructor(id, valor, motoboy, loja) {
        super(id);
        this.valor = valor;
        this.motoboy = motoboy.addPedido(this);
        this.loja = loja;
    }
};

const Loja = class Loja extends HasId {
    constructor(id, adicional) {
        super(id);
        this.pedidos = [];
        this.adicional = adicional;
    }

    addPedido(valor, motoboys) {
        this.pedidos = [ ...this.pedidos, new Pedido(this.pedidos.length + 1, valor, motoboys.getForLoja(this), this) ];
        return this;
    }
};

const MotoboyList = class MotoboyList {
    constructor() {
        this.motoboys = []
        this.nextId = 1;
        this.next = 0;
    }

    addMotoboy(valor, loja) {
        this.motoboys = [ ...this.motoboys, new Motoboy(this.nextId++, valor, loja) ];
        return this;
    }

    getForLoja(loja) {
        let motoboy = this.motoboys.find(motoboy => motoboy.loja && motoboy.loja.id === loja.id);
        if (motoboy === undefined) {
            motoboy = this.motoboys[this.next++];
            if (this.next >= this.motoboys.length)
                this.next = 0;
        }
        return motoboy;
    }
};

const LojaList = class LojaList {
    constructor() {
        this.lojas = [];
        this.nextId = 1;
    }

    addLoja(adicional) {
        this.lojas = [ ...this.lojas, new Loja(this.nextId++, adicional) ];
        return this;
    }
};

const lojas = new LojaList()
    .addLoja(0.05)
    .addLoja(0.05)
    .addLoja(0.15);

const motoboys = new MotoboyList()
    .addMotoboy(2)
    .addMotoboy(2)
    .addMotoboy(2)
    .addMotoboy(2, lojas.lojas[0])
    .addMotoboy(3);

lojas.lojas[0]
    .addPedido(50, motoboys)
    .addPedido(50, motoboys)
    .addPedido(50, motoboys);

lojas.lojas[1]
    .addPedido(50, motoboys)
    .addPedido(50, motoboys)
    .addPedido(50, motoboys)
    .addPedido(50, motoboys);

lojas.lojas[2]
    .addPedido(50, motoboys)
    .addPedido(50, motoboys)
    .addPedido(100, motoboys);

motoboys.motoboys.forEach(motoboy => {
    const nome = `Motoboy ${motoboy.id}`;
    console.log(nome);
    console.log(`\tTerá ${motoboy.pedidos.length} pedidos.`);
    motoboy.pedidos.forEach(pedido => 
        console.log(`\tNo pedido ${pedido.id} o ${nome} na loja ${pedido.loja.id} vai ganhar R\$ ${motoboy.valor + pedido.valor * pedido.loja.adicional};`)
    );
});