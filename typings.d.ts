
declare module "*.json" {
	const value: any;
	export default value;
}
declare module '*.scss' {
	const content: any;
	export default content;
}
declare module '*.css' {
  interface IClassNames {
    [className: string]: string
  }
  const classNames: IClassNames;
  export = classNames;
}

/*declare module BarCodeReader {
  export default Quagga;
}*/
/*
declare module "barcode-mod" {
  import * as Quagga from "quagga";
  import QuaggaTypeDef from "quagga/type-definitions/quagga";
  export default QuaggaTypeDef;
}*/