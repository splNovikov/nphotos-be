const sortByDate = (collection: any[], prop: string) =>
  collection.sort((firstEl, secondEl) =>
    new Date(secondEl[prop]).getTime() - new Date(firstEl[prop]).getTime());

export { sortByDate };
