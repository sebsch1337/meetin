interface Visit {
  visitors: number;
  date: number;
  notes: string;
}

export const getLastVisit = (visits: Visit[]): any =>
  visits?.length > 0 ? visits.reduce((prev, current) => (prev.date > current.date ? prev : current)) : false;

export const getLastVisitedDay = (visits: Visit[]): string => {
  const lastVisit = getLastVisit(visits);
  if (lastVisit) {
    return new Date(lastVisit.date * 1000).toLocaleDateString("de-DE", { dateStyle: "long" });
  } else {
    return "Nie";
  }
};

export const getAverageVisitors = (visits: Visit[]): string => {
  if (!visits || visits?.length === 0) {
    return "N/A";
  }
  const averageVisitors = Math.round(
    visits
      .slice(-3)
      .map((visit) => visit.visitors)
      .reduce((a, b) => a + b) / visits.length
  );
  const minVisitors = Math.min(...visits.slice(-3).map((visit) => visit.visitors));
  const maxVisitors = Math.max(...visits.slice(-3).map((visit) => visit.visitors));

  return `${averageVisitors} (${minVisitors} / ${maxVisitors})`;
};
