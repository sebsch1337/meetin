export const getAllTags = async (): Promise<Tag[]> => {
  const response = await fetch("/api/tags", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw Error;
  }
};
