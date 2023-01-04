export default function delay(value: number) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const original = descriptor.value;
    descriptor.value = async function (this: any, ...args: any[]) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(original?.apply(this, args)), value);
      });
    };

    return descriptor;
  };
}
