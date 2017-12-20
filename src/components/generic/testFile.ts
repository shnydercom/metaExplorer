export class A {
	static statVar = "A";
	tellMeStatVar = () => {
		console.log(this.constructor["statVar"]);
	}
}

export class B extends A {
	static statVar = "B";
	static secondStatVar = "B2";
}

var test = new B();
console.log(test);

function generateClass(classVar, input) {
	var newClass = class extends classVar {
		static statVar = input;
	}
	return newClass;
}

var C = generateClass(B, "C");
console.log(C);

var D = generateClass(C, "D");
console.log(D);
var test2 = new D();
test2.tellMeStatVar();
console.log("done");