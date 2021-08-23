import { createElement, ReactComponent, reactDOMRender } from "./react";

describe('React', () => {
    let body: Element;
    beforeEach(() => {
        document.body.innerHTML = ''
        body = document.body;
    });

    describe('with built-in elements', () => {
        it('should render the elements onto the page', async () => {
            reactDOMRender(createElement("div", {}), body);
            expect(body.children[0].tagName.toLowerCase()).toBe("div");
        });

        it('should set props', async () => {
            reactDOMRender(createElement("div", { "data-test": "tst" }), body);
            expect(body.children[0].getAttribute("data-test")).toBe("tst");
        });

        it('should render nested built-in elements', async () => {
            reactDOMRender(createElement("div", {
                children: [ createElement("span", { children: "hello" }) ]
            }), body);
            expect(body.children[0].innerHTML.toLowerCase()).toBe("<span>hello</span>");
        });
    });

    xdescribe('with custom components', () => {
        it('should render', async () => {
            class MyComponent extends ReactComponent<{}> {
                render() {
                    return createElement("div", {});
                }
            }

            reactDOMRender(createElement(MyComponent, {}), body);
            expect(body.children[0].tagName.toLowerCase()).toBe("div");
        });

        it('should apply props', async () => {
            class MyComponent extends ReactComponent<{ text: string }> {
                render() {
                    return createElement("div", { children: this.props.text });
                }
            }

            reactDOMRender(createElement(MyComponent, { text: "hello"}), body);
            expect(body.children[0].innerHTML).toBe("hello");
        });

        it('should render nested components', async () => {
            class Nested extends ReactComponent<{ text: string }> {
                render() {
                    return this.props.text;
                }
            }

            class MyComponent extends ReactComponent<{}> {
                render() {
                    return createElement("div", { children: [
                        createElement(Nested, { text: "hello," }),
                        createElement(Nested, { text: "world" }),
                    ] });
                }
            }

            reactDOMRender(createElement(MyComponent, {}), body);
            expect(body.children[0].innerHTML).toBe("hello,world");
        });
    });
});