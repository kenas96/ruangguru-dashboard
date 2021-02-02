import routes from '../routes';

const routeList = [];

routes.map((route) => {
  const { child } = route;

  if (!!child) {
    const child2 = child;
    return child2.map((route2) => {
      if (!!route2.child) {
        const child3 = route2.child;
        return child3.map((route3) => {
          routeList.push({
            ...route3
          });
          return null;
        });
      } else {
        routeList.push({
          ...route2
        });
      }
      return null;
    });
  } else {
    routeList.push({
      ...route
    });
  }
  return null;
});

export default routeList;
