export type ReactElement<
    Props = any,
    Type extends IReactComponentConstructor<Props> | string = IReactComponentConstructor<Props> | string
> = {
    type: Type,
    props: Props
};
export type ReactNode = null | string | number | ReactElement | ReactElement[];

export interface IReactComponent<P> {
    readonly props: P & { children?: ReactNode };
    render(): ReactNode;
}
interface IReactComponentConstructor<P> {
    new (props: P): IReactComponent<P>;
}

export abstract class ReactComponent<P> implements IReactComponent<P> {
    constructor(public readonly props: P & { children?: ReactNode }) {}
    abstract render(): ReactNode;
}

export declare function reactDOMRender(input: ReactElement, element: Element): void;


export function createElement<P>(component: IReactComponentConstructor<P> | string, props: P): ReactElement {
    return { type: component, props };
}

// How to pass props to custom vs built-in element
//
// declare const el: Element;
// el.setAttribute("name", "value");
//
// new CustomComponent(props)
//
// declare function childrenToArray(children: ReactNode): ReactNode[];
//
// type Tree<T> = {
//     value: T;
//     nested: Tree<T>[];
// }
// function traverse<T>(t: Tree<T>, cb: (val: T) => void) {
//     cb(t.value);
//     t.nested.forEach(x => traverse(x, cb));
// }
