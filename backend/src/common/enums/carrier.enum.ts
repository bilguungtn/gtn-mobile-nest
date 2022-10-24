class ECarriers {
  static readonly SOFTBANK = new ECarriers(0);
  static readonly Y_MOBILE = new ECarriers(1);
  static readonly N_COM = new ECarriers(2);
  static readonly UNKNOWN = new ECarriers(99);

  private constructor(public readonly code: number) {}
}

export default ECarriers;
