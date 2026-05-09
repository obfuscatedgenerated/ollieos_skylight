declare module "*.css" {
    const content: { use: (options?: {target?: HTMLElement | ShadowRoot}) => void; unuse: (options?: {target?: HTMLElement | ShadowRoot}) => void };
    export default content;
}
