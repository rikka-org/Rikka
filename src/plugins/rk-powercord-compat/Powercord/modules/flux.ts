const { getModule } = require('powercord/webpack');

export = async () => {
  const Flux = await getModule([ 'Store', 'PersistedStore' ]);
  Flux.connectStoresAsync = (stores: any, fn: (arg0: any[], arg1: any) => any) => (Component: any) =>
    require('powercord/components').AsyncComponent.from((async () => {
      const awaitedStores = await Promise.all(stores);
      return Flux.connectStores(awaitedStores, (props: any) => fn(awaitedStores, props))(Component);
    })());
};
