import { createApp } from 'vue';
import { TComponent } from './type';

export const createVueComponent = (component: TComponent) => {
    const app = createApp({});
    app.component(component.name, {
        template: component.template,
        data: () => component.data || {},
        props: component.props || {},
        methods: component.methods,
        onMounted: component.onMounted,
    });
    return app.component(component.name);
};