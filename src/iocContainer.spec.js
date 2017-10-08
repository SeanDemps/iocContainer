const assert = require('chai').assert;
const IocContainer = require('./IocContainer.js');

let container;

class A {
    one() {
        return 1;
    }

    two() {
        return 2;
    }
}

class B {
    constructor(numberService) {
        this.numberService = numberService;
    }

    addOne(num) {
        return this.numberService.one() + num;
    }

}

class C {
    constructor(adderService, numberService) {
        this.adderService = adderService;
        this.numberService = numberService;
    }

    addThree(num) {
        return this.adderService.addOne(num) + this.numberService.two();
    }
}

describe('IocContainer', () => {
    beforeEach(() => {
        container = new IocContainer();
    });

    it('register a class', () => {
        container.register(A, 'Num');
        const num = container.create('Num');

        assert.isTrue(num instanceof A);
        
        // check functionality?
        assert.equal(num.one(), 1);
    });

    it('register a class with a dependency', () => {
        container.register(B, 'Adder', ['Num']);        
        container.register(A, 'Num');

        const adder = container.create('Adder');

        assert.isTrue(adder instanceof B);
        assert.isTrue(adder.numberService instanceof A);
        
        // check functionality?
        assert.equal(adder.addOne(1), 2);
    });

    it('registers a class with multiple dependencies', () => {
        container.register(B, 'Adder', ['Num']);
        container.register(A, 'Num');
        container.register(C, 'SuperAdder', ['Adder', 'Num']);

        const superAdder = container.create('SuperAdder');

        assert.isTrue(superAdder instanceof C);
        assert.isTrue(superAdder.adderService instanceof B);
        assert.isTrue(superAdder.numberService instanceof A);
        // to be sure
        assert.isTrue(superAdder.adderService.numberService instanceof A);
        
        // check functionality?
        assert.equal(superAdder.addThree(1), 4);
    });
});
