import { getModule } from "../../NodeMod/powercord/webpack";

export = async () => {
    const flux = await getModule(['Store', 'PersistedStore']) as any;
    flux.connectStoresAsync = (stores: any[], fn: Function) => (Component: any) => {
        require('powercord/components').AsyncComponent.from((async () => {
            const awaitedStores = await Promise.all(stores);
            return flux.connectStores(awaitedStores, (props: any) => fn(awaitedStores, props))(Component);
        })());
    }
}