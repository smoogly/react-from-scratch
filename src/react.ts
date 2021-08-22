export type ReactElementType<Props extends {} = any> = string | IReactComponentConstructor<Props>;
export type ReactElement<
    Props extends {} = any,
    Type extends ReactElementType<Props> = ReactElementType<Props>,
> = {
    type: Type,
    props: Props
};
export type ReactNode = null | string | number | ReactElement | ReactElement[];

export interface IReactComponent<P extends {}> {
    readonly props: P & { children?: ReactNode };
    render(): ReactNode;
}
interface IReactComponentConstructor<P extends {}> {
    new (props: P): IReactComponent<P>;
}

export abstract class ReactComponent<P extends {}> implements IReactComponent<P> {
    constructor(public readonly props: P & { children?: ReactNode }) {}
    abstract render(): ReactNode;
}

export function createElement<P extends {}>(component: IReactComponentConstructor<P> | string, props: P, ...children: ReactNode[]): ReactElement {
    return { type: component, props: { ...props, children } };
}

const _childrenToArray = (children: ReactNode | ReactNode[]) => Array.isArray(children) ? children.flat() : [children];
const isNotNull = <T>(val: T | null): val is T => val !== null;
const childrenToArray = (children: ReactNode | ReactNode[]) => _childrenToArray(children).filter(isNotNull);

function _renderChildren(children: ReactNode, node: Element) {
    for (const child of childrenToArray(children)) {
        if (typeof child === "string" || typeof child === "number") {
            const text = document.createTextNode(child.toString());
            node.appendChild(text);
        } else {
            _render(child, node);
        }
    }
}
function _render(input: ReactElement, node: Element) {
    if (typeof input.type === "string") {
        const el = document.createElement(input.type);
        Object.keys(input.props)
            .filter(p => p !== "children")
            .forEach(prop => el.setAttribute(prop, input.props[prop]));

        _renderChildren(input.props.children ?? null, el);
        node.appendChild(el);
    } else {
        const instance = new input.type(input.props);
        _renderChildren(instance.render(), node);
    }
}
export function reactDOMRender(input: ReactElement, element: Element): void {
    element.innerHTML = "";
    _render(input, element);
}
