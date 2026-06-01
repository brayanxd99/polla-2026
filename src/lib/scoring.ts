export function calculatePoints(
  predictedHome: number,
  predictedAway: number,
  actualHome: number,
  actualAway: number
): { points: number; isExact: boolean } {
  // Exact match
  if (predictedHome === actualHome && predictedAway === actualAway) {
    return { points: 3, isExact: true }
  }

  // Tendency (Winner or Draw)
  const predictedDiff = predictedHome - predictedAway
  const actualDiff = actualHome - actualAway

  const predictedWinner = predictedDiff > 0 ? "HOME" : predictedDiff < 0 ? "AWAY" : "DRAW"
  const actualWinner = actualDiff > 0 ? "HOME" : actualDiff < 0 ? "AWAY" : "DRAW"

  if (predictedWinner === actualWinner) {
    return { points: 1, isExact: false }
  }

  return { points: 0, isExact: false }
}
