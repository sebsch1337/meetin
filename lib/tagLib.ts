export const getAllTags = async (): Promise<any> => {
  const response = await fetch("/api/tags", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  }
};
