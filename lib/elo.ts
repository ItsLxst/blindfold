const K = 32;

export function updateElo(ratingA: number, ratingB: number, winner: "A" | "B") {
  const expectedA = 1 / (1 + 10 ** ((ratingB - ratingA) / 400));
  const scoreA = winner === "A" ? 1 : 0;
  const delta = K * (scoreA - expectedA);

  return { newA: ratingA + delta, newB: ratingB - delta };
}