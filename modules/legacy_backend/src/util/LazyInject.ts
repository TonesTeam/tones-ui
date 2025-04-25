import {
    interfaces,
    decorate,
    Container,
    METADATA_KEY,
    inject,
} from 'inversify';

export function lazyInject(
    serviceIdentifierCallback: () => interfaces.ServiceIdentifier<any>,
): PropertyDecorator {
    return function (target: any, propertyKey) {
        // inject container as this.container if it's not present
        if (
            !Reflect.getMetadata(METADATA_KEY.TAGGED_PROP, target.constructor)
                ?.container
        ) {
            decorate(inject(Container), target, 'container');
        }

        // define getter
        Object.defineProperty(target, propertyKey, {
            get: function () {
                return this.container.get(serviceIdentifierCallback());
            },
        });
    };
}
