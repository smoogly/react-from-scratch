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

export const setAttributes = (el: HTMLElement, attrs: any) : void => {
    for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
    }
}

declare function renderCustomComponent<P>(type: IReactComponentConstructor<P>, props: P ): HTMLElement

export function reactDOMRender(input: ReactElement, element: Element): any{
    let dOMElement: any;
    if (typeof input === 'string'){
        // handle text nodes
        dOMElement = document.createTextNode(input)
    } else{
        const {type, props} = input;
        if(typeof type !== 'string'){
            // handle custom components
            dOMElement = renderCustomComponent(type, props)
        }else{
            // handle html tags
            dOMElement = document.createElement(type)
            if(props){
                const {children, ...otherProps} = props;
                setAttributes(dOMElement, otherProps);
                if(children){
                    [].concat(children).forEach(child => {
                        reactDOMRender(child, dOMElement)
                    })
                }
            }
        }
    }
    element.appendChild(dOMElement)
};


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
