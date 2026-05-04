export async function fetchText(url: string) {
  let response: Response;

  try {
    response = await fetch(url, {
      headers: {
        "user-agent":
          "taiwan-brands-crawler/0.1 (+https://github.com/kun1225/taiwan-brands)",
      },
    });
  } catch (error) {
    throw new Error(
      `Failed to fetch ${url}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  return response.text();
}

