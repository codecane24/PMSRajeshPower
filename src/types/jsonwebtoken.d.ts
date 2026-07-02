declare module 'jsonwebtoken' {
  interface SignOptions {
    algorithm?: string;
    expiresIn?: string | number;
    notBefore?: string | number;
    audience?: string | string[];
    issuer?: string;
    subject?: string;
    jwtid?: string;
    noTimestamp?: boolean;
    header?: object;
    keyid?: string;
    mutatePayload?: boolean;
  }

  interface VerifyOptions {
    algorithms?: string[];
    audience?: string | string[];
    issuer?: string | string[];
    subject?: string;
    clockTolerance?: number;
    maxAge?: string;
    clockTimestamp?: number;
    nonce?: string;
    ignoreExpiration?: boolean;
    ignoreNotBefore?: boolean;
    complete?: boolean;
  }

  function sign(payload: string | object | Buffer, secretOrPrivateKey: string, options?: SignOptions): string;
  function verify(token: string, secretOrPublicKey: string, options?: VerifyOptions): object | string;
  function decode(token: string, options?: { complete?: boolean; json?: boolean }): null | { [key: string]: any } | string;

  export { sign, verify, decode, SignOptions, VerifyOptions };
  export default { sign, verify, decode };
}
